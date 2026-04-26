// @/components/layouts/header.tsx
'use client';

import { SavedPostsBadge } from '@/components/composite/saved-posts-badge';
import { APP_ROUTES } from '@/config/routes';
import { USER_MENU_ITEMS } from '@/constants';
import { LogoutConfirmModal } from '@/features/auth/components/logout-confirm.modal';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/stores/auth.store';
import {
    CheckCircleFilled,
    ExclamationCircleFilled, // 🌟 Import thêm icon cảnh báo
    LogoutOutlined,
    MenuOutlined,
    SafetyCertificateTwoTone
} from '@ant-design/icons';
import { Avatar, Button, Divider, Drawer, Dropdown, Layout, Menu, Skeleton, Space, Tooltip, Typography } from 'antd'; // Bỏ Tag đi
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Header: AntdHeader } = Layout;
const { Title, Text } = Typography;

export function Header() {
    const { colorPrimaryBg, colorPrimary, colorBgContainer, colorBorderSecondary, colorError, colorTextSecondary, colorBgTextHover, colorText } = useAppTheme();
    const router = useRouter();
    const pathname = usePathname();

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const isInitialized = useAuthStore((state) => state.isInitialized);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const isSaleActive = pathname.startsWith(APP_ROUTES.PUBLIC.SALE);
    const isRentActive = pathname.startsWith(APP_ROUTES.PUBLIC.RENT);

    const activeNavKey = isSaleActive ? APP_ROUTES.PUBLIC.SALE : isRentActive ? APP_ROUTES.PUBLIC.RENT : '';

    const mainNavItems = [
        { key: APP_ROUTES.PUBLIC.SALE, label: <Link href={APP_ROUTES.PUBLIC.SALE}>Mua bán</Link> },
        { key: APP_ROUTES.PUBLIC.RENT, label: <Link href={APP_ROUTES.PUBLIC.RENT}>Cho thuê</Link> },
    ];

    const canAccessManage = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

    const userMenuItems = [
        ...(canAccessManage ? [
            {
                key: 'manage-dashboard',
                icon: <SafetyCertificateTwoTone twoToneColor={colorPrimary} />,
                label: <Link href={APP_ROUTES.MANAGE.DASHBOARD}><span className="font-medium text-blue-600">Hệ thống quản trị</span></Link>,
            },
            { type: 'divider' as const },
        ] : []),
        ...(USER_MENU_ITEMS || []),
        { type: 'divider' as const },
        {
            key: 'logout',
            icon: <LogoutOutlined style={{ color: colorError }} />,
            label: <span style={{ color: colorError }}>Đăng xuất</span>,
            onClick: () => {
                setIsLogoutConfirmOpen(true);
                setIsMobileMenuOpen(false);
            },
        },
    ];

    return (
        <>
            <AntdHeader
                style={{
                    background: colorBgContainer,
                    borderBottom: `1px solid ${colorBorderSecondary}`,
                    height: 55,
                }}
                className="sticky top-0 z-50 flex items-center justify-between !px-2 md:!px-4 shadow-sm"
            >
                {/* ================= TRÁI: LOGO & MAIN NAV ================= */}
                <div className="flex items-center gap-8 flex-1 h-full">
                    <Link href={APP_ROUTES.PUBLIC.HOME} className="flex items-center">
                        <Title level={4} style={{ margin: 0, color: colorPrimary, letterSpacing: '1px' }}>
                            BDS360
                        </Title>
                    </Link>

                    <div className="hidden md:block flex-1 max-w-[300px]" style={{ height: 52 }}>
                        <Menu
                            mode="horizontal"
                            selectedKeys={[activeNavKey]}
                            items={mainNavItems}
                            className="h-full"
                            style={{ background: 'transparent', borderBottom: 'none' }}
                        />
                    </div>
                </div>

                {/* ================= PHẢI: AUTH ACTIONS (DESKTOP) ================= */}
                <div className="hidden md:flex items-center gap-4 h-full">
                    {!isInitialized ? (
                        <div className="flex items-center h-full">
                            <Skeleton.Button active shape="default" style={{ display: 'block', width: 200, height: 32, minWidth: 0 }} />
                        </div>
                    ) : !isAuthenticated ? (
                        <Space size="small" align="center" className="h-full">
                            <Link href={APP_ROUTES.AUTH.LOGIN}>
                                <Button type="primary" className="font-medium shadow-sm">Đăng nhập</Button>
                            </Link>
                            <Link href={APP_ROUTES.AUTH.REGISTER}>
                                <Button type="text" className="font-medium !text-gray-600 hover:text-blue-600">Đăng ký</Button>
                            </Link>
                        </Space>
                    ) : (
                        <Space size="middle" align="center" className="h-full">
                            <SavedPostsBadge className="mt-1 mr-2" />

                            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                                <div
                                    className="group flex items-center gap-3 p-1 pr-3 rounded-full border border-transparent cursor-pointer transition-all hover:bg-slate-50"
                                    style={{ ['--hover-color' as any]: colorPrimary }}
                                >
                                    <Avatar
                                        className="transition-all group-hover:scale-105"
                                        src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`}
                                    />

                                    <div className="flex flex-col leading-tight">
                                        {/* 🌟 FIX CHIỀU NGANG: Chỉ dùng Icon cố định kích thước */}
                                        <div className="flex items-center gap-1.5">
                                            <Text
                                                className="font-semibold text-sm transition-colors truncate max-w-[120px]"
                                                style={{ color: 'inherit' }}
                                            >
                                                {user?.name}
                                            </Text>

                                            {user?.isVerified ? (
                                                <Tooltip getPopupContainer={(trigger) => trigger.parentElement!} placement="topLeft" title="Tài khoản đã xác thực">
                                                    <CheckCircleFilled style={{ color: colorPrimary, fontSize: '13px' }} className="mt-[2px]" />
                                                </Tooltip>
                                            ) : (
                                                <Tooltip getPopupContainer={(trigger) => trigger.parentElement!} placement="topLeft" title="Tài khoản chưa xác thực. Bấm để cập nhật!">
                                                    <Link href={APP_ROUTES.USER.PROFILE} onClick={(e) => e.stopPropagation()} className="flex mt-[2px]">
                                                        <ExclamationCircleFilled className="text-amber-500 text-[13px] hover:scale-110 transition-transform" />
                                                    </Link>
                                                </Tooltip>
                                            )}
                                        </div>

                                        <Text
                                            className="text-xs transition-colors truncate max-w-[140px]"
                                            type="secondary"
                                            style={{ color: 'inherit' }}
                                        >
                                            {user?.email}
                                        </Text>
                                    </div>
                                </div>
                            </Dropdown>
                        </Space>
                    )}
                </div>

                {/* ================= MOBILE ================= */}
                <div className="md:hidden flex items-center gap-3">
                    {isInitialized && isAuthenticated && (
                        <SavedPostsBadge className="mt-1.5" />
                    )}

                    <MenuOutlined
                        onClick={() => setIsMobileMenuOpen(true)}
                        style={{
                            fontSize: 20, color: colorText, borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = colorBgTextHover; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    />
                </div>

                <Drawer
                    title="Menu"
                    placement="right"
                    onClose={() => setIsMobileMenuOpen(false)}
                    open={isMobileMenuOpen}
                    size="default"
                    closable={{ placement: 'end' }}
                    styles={{ body: { padding: '12px 24px' } }}
                >
                    <div className="flex flex-col h-full">
                        <div className="py-2 border-b" style={{ borderColor: colorBorderSecondary, background: colorBgContainer }}>
                            {!isInitialized ? (
                                <div className="flex items-center gap-3 h-[40px]">
                                    <Skeleton.Avatar active size="large" />
                                    <div className="flex flex-col w-full gap-1">
                                        <Skeleton.Button active size="small" style={{ width: '60%', height: 16 }} />
                                    </div>
                                </div>
                            ) : isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    <Avatar size="large" src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`} />
                                    <div className="flex flex-col">
                                        {/* 🌟 MOBILE CŨNG DÙNG ICON ĐỂ ĐỒNG BỘ */}
                                        <div className="flex items-center gap-1.5">
                                            <Text className="font-semibold text-base">{user?.name}</Text>
                                            {user?.isVerified ? (
                                                <CheckCircleFilled style={{ color: colorPrimary, fontSize: '14px' }} className="mt-[2px]" />
                                            ) : (
                                                <Link href={APP_ROUTES.USER.PROFILE} onClick={() => setIsMobileMenuOpen(false)} className="flex mt-[2px]">
                                                    <ExclamationCircleFilled className="text-amber-500 text-[14px]" />
                                                </Link>
                                            )}
                                        </div>
                                        <Text type="secondary" className="text-sm">{user?.email}</Text>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Text type="secondary">Đăng nhập để trải nghiệm tốt nhất</Text>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link href={APP_ROUTES.AUTH.LOGIN}>
                                            <Button block onClick={() => setIsMobileMenuOpen(false)}>Đăng nhập</Button>
                                        </Link>
                                        <Link href={APP_ROUTES.AUTH.REGISTER}>
                                            <Button type="primary" block onClick={() => setIsMobileMenuOpen(false)}>Đăng ký</Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="py-2 flex-1 overflow-y-auto">
                            <Menu
                                mode="inline"
                                selectedKeys={[activeNavKey]}
                                items={mainNavItems}
                                style={{ borderRight: 'none' }}
                                onClick={() => setIsMobileMenuOpen(false)}
                            />

                            {isAuthenticated && isInitialized && (
                                <>
                                    <Divider style={{ margin: '8px 0' }} />
                                    <Menu
                                        mode="inline"
                                        selectedKeys={[pathname]}
                                        items={userMenuItems}
                                        style={{ borderRight: 'none' }}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </Drawer>
            </AntdHeader>

            <LogoutConfirmModal
                isOpen={isLogoutConfirmOpen}
                onClose={() => setIsLogoutConfirmOpen(false)}
            />
        </>
    );
}