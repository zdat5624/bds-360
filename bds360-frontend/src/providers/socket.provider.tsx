// @/providers/socket.provider.tsx
'use client';

import { envConfig } from '@/config';
import { NOTIFICATIONS_QUERY_KEYS } from '@/features/notifications/api/notifications.queries';
import { NotificationCount } from '@/features/notifications/api/types';
import { useAuthStore } from '@/stores';
import { authStorage } from '@/utils';
import { Client } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';
import { ReactNode, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';

export function SocketProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, user } = useAuthStore();
    const queryClient = useQueryClient(); // Dùng React Query làm Global State

    const stompClientRef = useRef<Client | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const token = authStorage.getToken();

        const socketUrl = envConfig.NEXT_PUBLIC_WS_URL;

        const client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },

            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log('🔗 WebSocket Connected');

            const topic = `/user/${user.id}/topic/notifications`;

            client.subscribe(topic, (message) => {
                if (message.body) {
                    try {
                        console.log(">>> message: ", message)
                        const newCounts: NotificationCount[] = JSON.parse(message.body);

                        // 👇 Ép kiểu Number ngay từ đây để tránh "9" > "10" = true
                        const totalUnread = newCounts.reduce((sum, item) => sum + Number(item.count || 0), 0);

                        // Cập nhật chi tiết
                        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEYS.unreadDetails(), newCounts);

                        // Cập nhật tổng số cho Badge (React Query sẽ báo cho BellButton re-render)
                        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEYS.unreadTotal(), totalUnread);

                        // Làm mới list để user thấy tin mới bay vào
                        queryClient.invalidateQueries({
                            queryKey: NOTIFICATIONS_QUERY_KEYS.lists(),
                        });

                        console.log("🔔 Socket update total:", totalUnread);
                    } catch (error) {
                        console.error('Lỗi parse WebSocket payload:', error);
                    }
                }
            });
        };

        client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
        };

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current && stompClientRef.current.active) {
                stompClientRef.current.deactivate();
                console.log('🔌 WebSocket Disconnected');
            }
        };
    }, [isAuthenticated, user, queryClient]);

    return <>{children}</>;
}