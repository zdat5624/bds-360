// @/components/layouts/manage-header.tsx
'use client';

import { MANAGE_MENU_ITEMS } from '@/constants';
import { useAppTheme } from '@/hooks/use-app-theme';
import { LogoutOutlined, SafetyCertificateTwoTone, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Layout, Typography } from 'antd';

const { Header: AntdHeader } = Layout;
const { Text } = Typography;

export function ManageHeader() {
    // Gọi token màu từ hook
    const { colorBgContainer, colorBorderSecondary, colorPrimary, colorTextSecondary } = useAppTheme();

    const mockUser = {
        name: 'Quản trị viên',
        email: 'admin@bds360.vn',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Admin'
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'mobile-nav-group',
            type: 'group',
            label: 'ĐIỀU HƯỚNG',
            className: 'md:hidden',
            children: MANAGE_MENU_ITEMS as any,
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
                { key: 'profile', icon: <UserOutlined />, label: 'Thông tin cá nhân' },
                { key: 'divider-2', type: 'divider' },
                { key: 'logout', icon: <LogoutOutlined />, danger: true, label: 'Đăng xuất' },
            ]
        }
    ];

    return (
        <AntdHeader
            style={{
                background: colorBgContainer,
                borderBottom: `1px solid ${colorBorderSecondary}`,
                height: 55,
                paddingInline: 0,
            }}
            className="sticky top-0 z-50 flex items-center justify-between !px-2 md:!px-4 shadow-sm"
        >
            {/* Vùng bên trái */}
            <div className="flex items-center h-full">
                <div className="md:hidden flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    {/* Bỏ mã HEX, dùng colorPrimary */}
                    <SafetyCertificateTwoTone twoToneColor={colorPrimary} className="text-[28px] flex-shrink-0" />
                    <div className="flex flex-col whitespace-nowrap mt-0.5">
                        {/* Bỏ text-slate-500, thay bằng inline style */}
                        <span
                            style={{ color: colorTextSecondary }}
                            className="font-semibold text-[10px] uppercase tracking-widest leading-none mb-1.5"
                        >
                            Hệ Thống Quản Trị
                        </span>
                        {/* Bỏ text-blue-700, thay bằng inline style */}
                        <span
                            style={{ color: colorPrimary }}
                            className="font-extrabold text-[15px] uppercase tracking-wide leading-none"
                        >
                            BDS 360
                        </span>
                    </div>
                </div>
            </div>

            {/* Vùng bên phải */}
            <div className="flex items-center h-full">
                <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                    <div className="flex items-center gap-3 cursor-pointer transition-opacity hover:opacity-80">
                        <Avatar src={mockUser.avatar} size="default" />
                        <div className="hidden sm:flex flex-col leading-tight">
                            <Text className="font-semibold text-sm">{mockUser.name}</Text>
                            <Text type="secondary" className="text-xs">{mockUser.email}</Text>
                        </div>
                    </div>
                </Dropdown>
            </div>
        </AntdHeader>
    );
}