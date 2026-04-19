// @/components/layouts/user-sidebar.tsx
'use client';

import { UserInfo } from '@/components/composite';
import { USER_MENU_ITEMS } from '@/constants/menus.constant';
import { ConfigProvider, Menu } from 'antd';
import { usePathname } from 'next/navigation';

export function UserSidebar() {
    const pathname = usePathname();
    const safePathname = pathname || '/user/profile';
    const activeKey = safePathname.endsWith('/') && safePathname !== '/' ? safePathname.slice(0, -1) : safePathname;

    return (
        <div className="flex flex-col h-full">
            <UserInfo />

            <div>
                <ConfigProvider
                    theme={{
                        components: {
                            Menu: {
                                itemMarginInline: 0,
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