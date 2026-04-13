// @/components/layouts/manage-sidebar.tsx
'use client';

import { MANAGE_MENU_ITEMS } from '@/constants';
import { Menu } from 'antd';
import { usePathname } from 'next/navigation';

export function ManageSidebar() {
    const pathname = usePathname();

    // Tìm key đang active dựa trên URL hiện tại
    // Chú ý: Cần đảm bảo các key trong MANAGE_MENU_ITEMS khớp với APP_ROUTES
    const selectedKeys = [pathname];

    return (
        <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            items={MANAGE_MENU_ITEMS}
            style={{
                borderRight: 0, // Xóa viền phải của Menu để không trùng với viền của Sider
                background: 'transparent',
            }}
        />
    );
}