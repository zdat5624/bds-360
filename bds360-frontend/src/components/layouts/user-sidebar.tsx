// @/components/layouts/user-sidebar.tsx
'use client';

import { USER_MENU_ITEMS } from '@/constants/menus.constant';
import { ConfigProvider, Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface UserSidebarProps {
    headerSlot?: ReactNode;
}

export function UserSidebar({ headerSlot }: UserSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const safePathname = pathname || '/user/profile';
    const activeKey = safePathname.endsWith('/') && safePathname !== '/' ? safePathname.slice(0, -1) : safePathname;


    return (
        // QUYỀN LỰC TẬP TRUNG: Thêm pt-6 và px-4 vào đây
        <div className="flex flex-col h-full">

            {headerSlot}

            <div>
                {/* 👇 DÙNG CONFIG PROVIDER ĐỂ CAN THIỆP SÂU VÀO MENU */}
                <ConfigProvider
                    theme={{
                        components: {
                            Menu: {
                                // 1. Xóa khoảng cách ngoài: Giúp dải màu highlight tràn sát mép
                                itemMarginInline: 0,

                                // 2. Tùy chỉnh khoảng cách trong: Bạn có thể set = 0 nếu muốn sát rịt, 
                                // nhưng khuyên dùng khoảng 12px hoặc 16px để chữ thẳng hàng với Avatar
                                // itemPaddingInline: 12,

                                // (Tùy chọn) Bỏ luôn độ bo góc nếu bạn thích vuông vức
                                // itemBorderRadius: 0,
                            },
                        },
                    }}
                >
                    <Menu
                        theme="light"
                        mode="inline"
                        selectedKeys={[activeKey]}
                        items={USER_MENU_ITEMS}
                        style={{ borderRight: 0 }}
                    />
                </ConfigProvider>
            </div>
        </div>
    );
}