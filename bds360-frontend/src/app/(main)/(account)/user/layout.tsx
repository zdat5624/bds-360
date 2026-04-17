// @/app/(main)/(account)/user/layout.tsx
'use client';

import { UserSidebar } from '@/components/layouts/user-sidebar';
import { UserInfo } from '@/features/users/components/user-info';
import { useAppTheme } from '@/hooks/use-app-theme';
import { MenuOutlined } from '@ant-design/icons';
import { Drawer, FloatButton, Layout } from 'antd';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

const { Sider, Content } = Layout;

export default function AccountLayout({ children }: { children: ReactNode }) {
    const { colorBgContainer, colorBorderSecondary } = useAppTheme();
    const pathname = usePathname();

    // State quản lý việc mở Drawer trên mobile
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Tự động đóng menu khi người dùng click chuyển trang trên mobile
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Gom Sidebar và các class padding (pt-6 px-4) vào 1 biến để tái sử dụng
    // cho cả Sider (Desktop) và Drawer (Mobile) mà không bị lặp code
    const sidebarContent = (
        <div className="h-full pt-6 px-4">
            <UserSidebar headerSlot={<UserInfo />} />
        </div>
    );

    return (
        <Layout hasSider style={{ background: colorBgContainer }} className="flex-1 w-full">

            {/* 1. HIỂN THỊ TRÊN DESKTOP (Màn hình lớn) */}
            <Sider
                theme="light"
                width={260}
                breakpoint="lg"
                collapsedWidth="0"
                trigger={null}
                style={{
                    borderRight: `1px solid ${colorBorderSecondary}`,
                    background: colorBgContainer,
                }}
                // Ẩn Sider mặc định trên mobile, chỉ hiện từ màn lg (Desktop)
                className="hidden lg:block"
            >
                {sidebarContent}
            </Sider>

            {/* 2. HIỂN THỊ TRÊN MOBILE (Drawer trượt) */}
            <Drawer
                placement="left"
                closable={false}
                onClose={() => setIsMobileMenuOpen(false)}
                open={isMobileMenuOpen}
                size="default" // hoặc "large"
                styles={{ body: { padding: 0 } }}
            >
                {sidebarContent}
            </Drawer>

            {/* 3. KHU VỰC HIỂN THỊ NỘI DUNG CHÍNH */}
            <Layout style={{ background: colorBgContainer }}>

                {/* NÚT NỔI (FLOAT BUTTON) */}
                <div className="lg:hidden">
                    {!isMobileMenuOpen && (
                        <FloatButton
                            icon={<MenuOutlined />}
                            type="primary"
                            onClick={() => setIsMobileMenuOpen(true)}
                            style={{ bottom: 24, left: 24 }}
                            tooltip="Menu tài khoản"
                        />
                    )}
                </div>

                <Content className="p-2 md:px-4 md:py-6">
                    <div className="w-full">
                        {children}
                    </div>
                </Content>
            </Layout>

        </Layout>
    );
}