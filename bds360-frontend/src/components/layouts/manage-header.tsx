// @/components/layouts/manage-header.tsx
'use client';

import { APP_ROUTES } from '@/config/routes';
import { getFilteredManageMenu } from '@/constants';
import { LogoutConfirmModal } from '@/features/auth/components/logout-confirm.modal';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/stores/auth.store';
import {
    DashboardOutlined,
    HomeOutlined,
    LogoutOutlined,
    SafetyCertificateTwoTone,
    UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Flex, Layout, Skeleton, Typography } from 'antd';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const { Header: AntdHeader } = Layout;
const { Text } = Typography;

export function ManageHeader() {
    const { colorBgContainer, colorBorderSecondary, colorPrimary, colorTextSecondary } = useAppTheme();

    // Lấy thông tin user và trạng thái khởi tạo từ store
    const { user, isInitialized } = useAuthStore();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // 🌟 SỬ DỤNG LOGIC LỌC MENU ĐÃ TÁCH RIÊNG
    const filteredMenuItems = useMemo(() => getFilteredManageMenu(user?.role), [user?.role]);

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'mobile-nav-group',
            type: 'group',
            label: 'ĐIỀU HƯỚNG QUẢN TRỊ',
            className: 'md:hidden', // Chỉ hiển thị trong dropdown khi ở mobile
            children: filteredMenuItems as any,
        },
        {
            key: 'divider-1',
            type: 'divider',
            className: 'md:hidden',
        },
        {
            key: 'user-group',
            type: 'group',
            label: 'TÀI KHOẢN',
            children: [
                {
                    key: 'home',
                    icon: <HomeOutlined />,
                    label: <Link href={APP_ROUTES.PUBLIC.HOME}>Về trang chủ công khai</Link>
                },
                {
                    key: 'user-dashboard',
                    icon: <DashboardOutlined />,
                    label: <Link href={APP_ROUTES.USER.DASH_BOARD}>Bảng điều khiển cá nhân</Link>
                },
                { key: 'divider-2', type: 'divider' },
                {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    danger: true,
                    label: 'Đăng xuất hệ thống',
                    onClick: () => setIsLogoutModalOpen(true)
                },
            ]
        }
    ];

    return (
        <>
            <AntdHeader
                style={{
                    background: colorBgContainer,
                    borderBottom: `1px solid ${colorBorderSecondary}`,
                    height: 55,
                    paddingInline: 0,
                }}
                className="sticky top-0 z-50 flex items-center justify-between !px-2 md:!px-4 shadow-sm"
            >
                {/* Vùng bên trái: Logo (Chỉ hiện trên Mobile vì PC đã có ở Sidebar) */}
                <div className="flex items-center h-full">
                    <div className="md:hidden flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                        <SafetyCertificateTwoTone twoToneColor={colorPrimary} className="text-[28px] flex-shrink-0" />
                        <div className="flex flex-col whitespace-nowrap mt-0.5">
                            <span
                                style={{ color: colorTextSecondary }}
                                className="font-semibold text-[10px] uppercase tracking-widest leading-none mb-1.5"
                            >
                                BACK-OFFICE
                            </span>
                            <span
                                style={{ color: colorPrimary }}
                                className="font-extrabold text-[15px] uppercase tracking-wide leading-none"
                            >
                                BDS 360
                            </span>
                        </div>
                    </div>
                </div>

                {/* Vùng bên phải: User Info & Actions */}
                <Flex align="center" gap={12}>
                    <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                        <div className="flex items-center gap-3 cursor-pointer transition-opacity hover:opacity-80 p-1 rounded-md">


                            {/* Hiển thị Skeleton khi đang tải thông tin user */}
                            {!isInitialized ? (

                                <div className="flex items-center h-full gap-3">
                                    <Skeleton.Avatar active size="default" shape="circle" style={{ display: 'block', height: 32, minWidth: 0 }} />
                                    <Skeleton.Input active size="default" style={{ display: 'block', width: 100, height: 32, minWidth: 0 }} />
                                </div>
                            ) : (
                                <><Avatar
                                    src={user?.avatar}
                                    icon={!user?.avatar && <UserOutlined />}
                                    size="default"
                                    className="border"
                                />
                                    <div className="hidden md:flex flex-col leading-tight text-left">
                                        <Text className="font-semibold text-sm line-clamp-1">{user?.name || 'Nhân viên'}</Text>
                                        <Text type="secondary" className="text-[10px] uppercase font-medium">
                                            {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Kiểm duyệt viên'}
                                        </Text>
                                    </div>
                                </>
                            )}
                        </div>
                    </Dropdown>
                </Flex>
            </AntdHeader>

            {/* Modal xác nhận đăng xuất */}
            <LogoutConfirmModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
            />
        </>
    );
}