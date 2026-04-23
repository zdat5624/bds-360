// @/app/(main)/(account)/user/layout.tsx
'use client';

import { Footer } from '@/components/layouts';
import { UserSidebar } from '@/components/layouts/user-sidebar';
import { useAppTheme } from '@/hooks/use-app-theme';
import { MenuOutlined } from '@ant-design/icons';
import { Drawer, FloatButton, Layout } from 'antd';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

const { Sider, Content } = Layout;

export default function AccountLayout({ children }: { children: ReactNode }) {
    const { colorBgContainer, colorBorderSecondary } = useAppTheme();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);


    const sidebarContent = (
        <div className="h-full py-6 px-4">
            <UserSidebar />
        </div>
    );

    return (
        <Layout>
            <Layout hasSider style={{ background: colorBgContainer }} className="flex-1 w-full">
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
                    className="hidden lg:block"
                >
                    {sidebarContent}
                </Sider>

                <Drawer
                    placement="left"
                    closable={false}
                    onClose={() => setIsMobileMenuOpen(false)}
                    open={isMobileMenuOpen}
                    styles={{ body: { padding: 0 } }}
                >
                    {sidebarContent}
                </Drawer>

                <Layout style={{ background: colorBgContainer }}>
                    <div className="lg:hidden">
                        {!isMobileMenuOpen && (
                            <FloatButton
                                icon={<MenuOutlined />}
                                type="primary"
                                onClick={() => setIsMobileMenuOpen(true)}
                                style={{ bottom: 24, left: 24 }}
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
            <Footer />
        </Layout>
    );
}