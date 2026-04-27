// @/app/(back-office)/manage/layout.tsx
'use client';

import { ManageFooter } from '@/components/layouts/manage-footer';
import { ManageHeader } from '@/components/layouts/manage-header';
import { ManageSidebar } from '@/components/layouts/manage-sidebar';
import { ADMIN_ONLY_ROUTES, APP_ROUTES } from '@/config';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/stores/auth.store';
import { LeftOutlined, RightOutlined, SafetyCertificateTwoTone } from '@ant-design/icons';
import { Button, Layout, message } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { ReactNode, useEffect, useState } from 'react';

const { Sider, Content } = Layout;

export default function ManageLayout({ children }: { children: ReactNode }) {

    const pathname = usePathname();
    const user = useAuthStore(state => state.user);

    const router = useRouter();
    useEffect(() => {
        if (user && user.role === 'MODERATOR') {
            const isForbidden = ADMIN_ONLY_ROUTES.some(route => pathname.startsWith(route));
            if (isForbidden) {
                router.push(APP_ROUTES.MANAGE.DASHBOARD);
                message.warning('Bạn không có quyền truy cập khu vực này');
            }
        }
    }, [pathname, user, router]);

    const {
        colorBgContainer,
        colorBorderSecondary,
        colorBgLayout,
        colorPrimary,
        colorTextSecondary,
    } = useAppTheme();

    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                theme="light"
                width={260}
                trigger={null}
                collapsible
                collapsed={collapsed}
                breakpoint="md"
                className="hidden md:block"
                style={{
                    borderRight: `1px solid ${colorBorderSecondary}`,
                    background: colorBgContainer,
                    position: 'relative',
                }}
            >
                <Button
                    shape="circle"
                    size="small"
                    // Xóa các class màu của Tailwind ở đây
                    className="hidden md:flex items-center justify-center shadow-sm transition-colors"
                    style={{
                        position: 'absolute',
                        right: -12,
                        top: 108,
                        zIndex: 100,
                        background: colorBgContainer,
                        // borderColor: colorBorder,
                        color: colorTextSecondary,
                    }}
                    icon={collapsed ? <RightOutlined style={{ fontSize: 10 }} /> : <LeftOutlined style={{ fontSize: 10 }} />}
                    onClick={() => setCollapsed(!collapsed)}
                />

                <div className="flex flex-col h-full">
                    {/* Khu vực Logo */}
                    <div className="flex items-center h-[55px] flex-shrink-0 transition-all duration-300"
                        style={{
                            borderBottom: `1px solid ${colorBorderSecondary}`,
                            height: 55,
                        }}
                    >
                        <div className='!px-2 md:!px-4'>
                            <Link
                                href={APP_ROUTES.MANAGE.DASHBOARD}
                                className={`flex items-center w-full h-full gap-3 hover:opacity-80 transition-opacity ${collapsed ? 'justify-center' : 'justify-start'}`}
                            >
                                {!collapsed ? (
                                    <>
                                        <SafetyCertificateTwoTone twoToneColor={colorPrimary} className="text-[28px] flex-shrink-0" />
                                        <div className="flex flex-col whitespace-nowrap mt-0.5">
                                            <span
                                                style={{ color: colorTextSecondary }}
                                                className="font-semibold text-[10px] uppercase tracking-widest leading-none mb-1.5"
                                            >
                                                Hệ Thống Quản Trị
                                            </span>
                                            <span
                                                style={{ color: colorPrimary }}
                                                className="font-extrabold text-[15px] uppercase tracking-wide leading-none"
                                            >
                                                BDS 360
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <SafetyCertificateTwoTone twoToneColor={colorPrimary} className="text-[28px]" />
                                )}
                            </Link>
                        </div>
                    </div>

                    {/* Khu vực Sidebar */}
                    <div className=" !px-2 md:!px-4 flex-1 overflow-y-auto pt-2 pb-4 custom-scrollbar">
                        <ManageSidebar />
                    </div>
                </div>
            </Sider>

            <Layout className="flex flex-col" style={{ background: colorBgLayout }}>
                <ManageHeader />

                <Content className="p-4 md:p-6 flex-1 flex flex-col">
                    <div
                        className="w-full flex-1 flex flex-col !p-0"
                        style={{
                            borderColor: colorBorderSecondary
                        }}
                    >
                        {children}
                    </div>
                </Content>

                <ManageFooter />
            </Layout>
        </Layout>
    );
}