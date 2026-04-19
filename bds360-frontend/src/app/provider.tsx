// @/app/provider.tsx
'use client';

import { antdTheme } from '@/config/theme';
import { AuthProvider } from '@/providers';
import { SocketProvider } from '@/providers/socket.provider'; // 👈 1. Bổ sung import
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App, ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () => new QueryClient({
            defaultOptions: {
                queries: { staleTime: 60 * 1000, refetchOnWindowFocus: false },
            },
        })
    );

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            <QueryClientProvider client={queryClient}>
                <ConfigProvider locale={viVN} theme={antdTheme}>
                    <App>
                        <AuthProvider>
                            <SocketProvider>
                                {children}
                            </SocketProvider>
                        </AuthProvider>
                    </App>
                </ConfigProvider>
            </QueryClientProvider>
        </GoogleOAuthProvider>
    );
}