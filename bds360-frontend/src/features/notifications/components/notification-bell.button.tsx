// @/features/notifications/components/notification-bell.button.tsx
'use client';

import { useAppTheme } from '@/hooks/use-app-theme';
import { BellOutlined } from '@ant-design/icons';
import { Badge, Button, Popover } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useGetUnreadCount } from '../api/notifications.queries';
import { NotificationPopoverContent } from './notification.popover';

export function NotificationBellButton() {
    const { colorTextSecondary } = useAppTheme();
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [shouldShake, setShouldShake] = useState(false);

    // Bỏ gán default = 0 ở đây để ta có thể check trạng thái undefined
    const { data: unreadCount } = useGetUnreadCount();
    const currentCount = unreadCount ?? 0;

    // Khởi tạo Ref là undefined thay vì số để đánh dấu "lần load đầu tiên"
    const prevUnreadCountRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        // CHỈ rung khi:
        // 1. Đã qua lần load API đầu tiên (prev !== undefined)
        // 2. Số lượng mới thực sự LỚN HƠN số lượng cũ
        if (prevUnreadCountRef.current !== undefined && currentCount > prevUnreadCountRef.current) {
            setShouldShake(true);
            const timer = setTimeout(() => setShouldShake(false), 500);

            prevUnreadCountRef.current = currentCount;
            return () => clearTimeout(timer);
        }

        // Nếu data đã lấy xong từ API (không còn undefined), cập nhật mốc Ref
        if (unreadCount !== undefined) {
            prevUnreadCountRef.current = currentCount;
        }
    }, [currentCount, unreadCount]);

    return (
        <Popover
            content={<NotificationPopoverContent onClose={() => setPopoverOpen(false)} />}
            trigger="click"
            placement="bottomRight"
            arrow={false}
            destroyOnHidden={true}
            styles={{ container: { padding: 0 } }}
            open={popoverOpen}
            onOpenChange={setPopoverOpen}
        >
            <Badge count={currentCount} size="medium" offset={[-4, 4]}
                style={{
                    fontSize: '10px',
                    width: '20px',
                    height: '20px',
                    lineHeight: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Button
                    type="text"
                    shape="circle"
                    className={`${shouldShake ? 'animate-shake' : ''}`}
                    icon={<BellOutlined style={{ color: colorTextSecondary, fontSize: '21px' }} />}
                />
            </Badge>
        </Popover>
    );
}