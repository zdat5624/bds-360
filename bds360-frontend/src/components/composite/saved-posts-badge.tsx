// @/components/composite/saved-posts-badge.tsx
'use client';

import { APP_ROUTES } from '@/config';
import { useGetSavedPosts } from '@/features/posts/api/posts.queries';
import { useAppTheme } from '@/hooks/use-app-theme';
import { HeartOutlined } from '@ant-design/icons';
import { Badge, Button, Tooltip } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface SavedPostsBadgeProps {
    className?: string;
}

export function SavedPostsBadge({ className }: SavedPostsBadgeProps) {
    const router = useRouter();
    const { colorPrimary } = useAppTheme();

    // State quản lý hiệu ứng rung
    const [shouldShake, setShouldShake] = useState(false);
    const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const prevCountRef = useRef<number | undefined>(undefined);

    // Lấy danh sách tin đã lưu để lấy tổng số lượng (totalElements)
    const { data: savedData, isSuccess } = useGetSavedPosts({ page: 0, size: 1 });
    const currentCount = savedData?.totalElements ?? 0;

    // Logic rung khi số lượng tăng lên (có tin mới được lưu)
    useEffect(() => {
        if (!isSuccess) return;

        if (prevCountRef.current !== undefined && currentCount > prevCountRef.current) {
            setShouldShake(true);
            if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
            shakeTimeoutRef.current = setTimeout(() => setShouldShake(false), 500);
        }

        prevCountRef.current = currentCount;
    }, [currentCount, isSuccess]);

    return (
        <div className={className}>
            <Tooltip title="Tin đã lưu. Bấm để xem tất cả" mouseEnterDelay={0.5}>
                <div
                    className={`relative cursor-pointer transition-transform active:scale-95 ${shouldShake ? 'animate-shake' : ''}`}
                    onClick={() => router.push(APP_ROUTES.USER.SAVED_POSTS)} // Đường dẫn trang tin đã lưu của bạn
                >
                    <Badge
                        count={currentCount}
                        size="small"
                        offset={[-2, 4]}
                        showZero={false}
                        style={{
                            backgroundColor: colorPrimary,
                            fontSize: '12px',
                            width: '22px',
                            height: '22px',
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
                            className="flex items-center justify-center hover:bg-gray-100"
                            icon={
                                <HeartOutlined
                                    style={{
                                        fontSize: '18px',
                                        color: currentCount > 0 ? colorPrimary : '#bfbfbf',
                                        transition: 'color 0.3s ease'
                                    }}
                                />
                            }
                        />
                    </Badge>
                </div>
            </Tooltip>
        </div>
    );
}