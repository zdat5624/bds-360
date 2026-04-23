// @/features/notifications/components/floating-notification.button.tsx
'use client';

import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/stores/auth.store'; // Đã import sẵn từ code của bạn
import { BellOutlined, CloseOutlined } from '@ant-design/icons';
import { Badge, Button, Popover } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useGetUnreadCount } from '../api/notifications.queries';
import { NotificationPopoverContent } from './notification.popover';

export function FloatingNotificationButton() {
    const {
        colorBgElevated,
        colorText,
        colorTextSecondary,
        colorPrimary,
        boxShadowSecondary,
        colorTextLightSolid
    } = useAppTheme();

    // 🌟 THÊM: Lấy trạng thái từ AuthStore
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isInitialized = useAuthStore((state) => state.isInitialized);

    const [popoverOpen, setPopoverOpen] = useState(false);
    const [showLabel, setShowLabel] = useState(false);
    const [shouldShake, setShouldShake] = useState(false);

    // State quản lý hiệu ứng Pulse tỏa sáng liên tục
    const [isPulsing, setIsPulsing] = useState(false);

    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { data: unreadCount, isSuccess } = useGetUnreadCount(isAuthenticated);
    const currentCount = unreadCount ?? 0;

    const prevUnreadCountRef = useRef<number | undefined>(undefined);

    // --- LOGIC QUẢN LÝ TRẠNG THÁI ---
    useEffect(() => {
        if (!isSuccess || unreadCount === undefined) return;

        if (prevUnreadCountRef.current === undefined) {
            prevUnreadCountRef.current = currentCount;
            return;
        }

        // KHI CÓ TIN MỚI BAY TỚI
        if (currentCount > prevUnreadCountRef.current) {

            // 1. Text Label (Hiện 5s)
            setShowLabel(true);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = setTimeout(() => setShowLabel(false), 5000);

            // 2. Shake (Rung 0.5s)
            setShouldShake(true);
            if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
            shakeTimeoutRef.current = setTimeout(() => setShouldShake(false), 500);

            // 3. Pulse (Tỏa sáng liên tục) - Bật mọi lúc mọi nơi
            setIsPulsing(true);
        }
        // KHI SỐ LƯỢNG GIẢM HOẶC BẰNG 0
        else if (currentCount < prevUnreadCountRef.current || currentCount === 0) {
            setShowLabel(false);
            setIsPulsing(false); // Tắt Pulse ngay lập tức
        }

        prevUnreadCountRef.current = currentCount;
    }, [currentCount, unreadCount, isSuccess]);

    // --- HANDLERS ---
    const handleCloseLabel = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowLabel(false);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };

    // QUẢN LÝ TẮT PULSE KHI CLICK
    const handleOpenChange = (open: boolean) => {
        setPopoverOpen(open);
        if (open) {
            // Khi người dùng bấm mở Popover -> Tắt Pulse
            setIsPulsing(false);
        }
    };

    // 🌟 THÊM: Kiểm tra auth (Đặt ngay trước lệnh return JSX)
    if (!isInitialized || !isAuthenticated) {
        return null; // Không render nút chuông nếu chưa đăng nhập hoặc app chưa khởi tạo xong auth
    }

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <Popover
                content={<NotificationPopoverContent onClose={() => setPopoverOpen(false)} />}
                trigger="click"
                placement="topRight"
                arrow={false}
                destroyOnHidden={true}
                styles={{ container: { padding: 0 } }}
                open={popoverOpen}
                onOpenChange={handleOpenChange}
            >
                {/* Lớp isolate để z-index hoạt động chuẩn, tránh viền pulse đè lên content */}
                <div
                    className="flex items-center rounded-full cursor-pointer transition-all duration-500 ease-in-out isolate relative"
                    style={{
                        backgroundColor: colorBgElevated,
                        boxShadow: boxShadowSecondary,
                        padding: showLabel ? '6px 6px 6px 16px' : '4px',
                    }}
                >
                    <div
                        className="overflow-hidden transition-all duration-500 ease-in-out flex items-center"
                        style={{
                            width: showLabel ? '190px' : '0px',
                            opacity: showLabel ? 1 : 0
                        }}
                    >
                        <div
                            key={currentCount}
                            className="flex font-semibold text-[13px] pt-1"
                            style={{ color: colorPrimary }}
                        >
                            {"Bạn có thông báo mới!".split('').map((char, index) => (
                                <span
                                    key={index}
                                    className={`inline-block ${showLabel ? 'animate-wave-text' : ''}`}
                                    style={{
                                        animationDelay: `${index * 0.04}s`,
                                        whiteSpace: char === ' ' ? 'pre' : 'normal',
                                    }}
                                >
                                    {char}
                                </span>
                            ))}
                        </div>

                        <Button
                            type="text"
                            shape="circle"
                            size="small"
                            className="ml-2 flex items-center justify-center shrink-0 relative z-20"
                            icon={<CloseOutlined style={{ fontSize: '10px', color: colorTextSecondary }} />}
                            onClick={handleCloseLabel}
                        />
                    </div>

                    <div
                        key={`shake-${currentCount}`}
                        className={`relative ${shouldShake ? 'animate-shake' : ''}`}
                    >
                        {/* VÒNG SÁNG PULSE RADAR (Nằm dưới cùng)  */}
                        {isPulsing && (
                            <div
                                className="absolute inset-1 rounded-full animate-ping opacity-75"
                                style={{ backgroundColor: colorPrimary }}
                            />
                        )}

                        <Badge
                            count={currentCount}
                            offset={[-2, 2]}

                            style={{
                                fontSize: '12px',
                                width: '26px',
                                height: '26px',
                                lineHeight: '20px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {/* 👇 ĐÃ FIX: Xóa sạch relative z-10 ở thẻ này */}
                            <div
                                className="flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300"
                                style={{
                                    backgroundColor: showLabel ? 'transparent' : colorPrimary,
                                }}
                            >
                                <BellOutlined
                                    style={{
                                        fontSize: '20px',
                                        color: showLabel ? colorText : colorTextLightSolid
                                    }}
                                />
                            </div>
                        </Badge>
                    </div>
                </div>
            </Popover>
        </div>
    );
}