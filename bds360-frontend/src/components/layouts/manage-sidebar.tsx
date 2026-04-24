// @/components/layouts/manage-sidebar.tsx
'use client';

import { getFilteredManageMenu } from '@/constants/menus.constant';
import { useAuthStore } from '@/stores/auth.store';
import { Menu, Skeleton } from 'antd';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export function ManageSidebar() {
    const pathname = usePathname();
    // Lấy thêm isInitialized từ store
    const { user, isInitialized } = useAuthStore();

    // 🌟 Trick cơ bản chống Hydration Error: Đảm bảo chỉ render sau khi Component mount
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Tìm key đang active dựa trên URL hiện tại
    const selectedKeys = [pathname];

    const menuItems = useMemo(() => getFilteredManageMenu(user?.role), [user?.role]);

    // 🌟 Nếu chưa mount xong HOẶC store chưa đọc xong localStorage -> Trả về Skeleton giả lập Menu
    if (!isMounted || !isInitialized) {
        return (
            <div className="flex flex-col gap-1 p-4">
                {[...Array(8)].map((_, i) => (
                    <Skeleton.Button key={i} active size="small" block className="!h-8" />
                ))}
            </div>
        );
    }

    return (
        <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            items={menuItems}
            style={{
                borderRight: 0,
                background: 'transparent',
            }}
        />
    );
}