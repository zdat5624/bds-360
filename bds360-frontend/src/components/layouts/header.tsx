// @/components/layouts/header.tsx
'use client';

import { APP_ROUTES } from '@/config/routes';
import { USER_MENU_ITEMS } from '@/constants';
import { useAppTheme } from '@/hooks/use-app-theme';
import {
    BellOutlined,
    LogoutOutlined,
    MenuOutlined
} from '@ant-design/icons';
import { Avatar, Badge, Button, Divider, Drawer, Dropdown, Layout, Menu, Space, Typography } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Header: AntdHeader } = Layout;
const { Title, Text } = Typography;

export function Header() {
    const { colorPrimary, colorBgContainer, colorBorderSecondary, colorError, colorTextSecondary } = useAppTheme();
    const router = useRouter();
    const pathname = usePathname();


    // 1. MOCK STATE
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
    const mockUser = {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=A',
    };

    // 2. STATE CHO MOBILE DRAWER
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // KIỂM TRA TRẠNG THÁI ACTIVE CỦA ROUTE
    const isSaleActive = pathname.startsWith(APP_ROUTES.PUBLIC.SALE);
    const isRentActive = pathname.startsWith(APP_ROUTES.PUBLIC.RENT);

    // Xác định key đang active để truyền vào Antd Menu
    const activeNavKey = isSaleActive
        ? APP_ROUTES.PUBLIC.SALE
        : isRentActive
            ? APP_ROUTES.PUBLIC.RENT
            : '';

    // CẤU HÌNH MENU CHÍNH (Dùng chung cho Desktop và Mobile)
    const mainNavItems = [
        {
            key: APP_ROUTES.PUBLIC.SALE,
            label: <Link href={APP_ROUTES.PUBLIC.SALE}>Mua bán</Link>,
        },
        {
            key: APP_ROUTES.PUBLIC.RENT,
            label: <Link href={APP_ROUTES.PUBLIC.RENT}>Cho thuê</Link>,
        },
    ];

    // 3. CẤU HÌNH MENU DÀNH CHO USER
    const userMenuItems = [
        ...(USER_MENU_ITEMS || []), // Kế thừa toàn bộ menu chuẩn
        { type: 'divider' as const }, // Vách ngăn cho Desktop Dropdown
        {
            key: 'logout',
            icon: <LogoutOutlined style={{ color: colorError }} />,
            label: <span style={{ color: colorError }}>Đăng xuất</span>,
            onClick: () => {
                setIsAuthenticated(false);
            },
        },
    ];

    return (
        <AntdHeader
            style={{
                background: colorBgContainer,
                borderBottom: `1px solid ${colorBorderSecondary}`,
                height: 55,
            }}
            className="sticky top-0 z-50 flex items-center justify-between px-2 md:px-4 shadow-sm"
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
                        style={{
                            background: 'transparent',
                            borderBottom: 'none',
                            // lineHeight: '64px',
                        }}
                    />
                </div>
            </div>

            {/* ================= PHẢI: AUTH ACTIONS (DESKTOP) ================= */}
            <div className="hidden md:flex items-center gap-4">
                {!isAuthenticated ? (
                    <Space>
                        <Link href={APP_ROUTES.AUTH.LOGIN}><Button type="default">Đăng nhập</Button></Link>
                        <Link href={APP_ROUTES.AUTH.REGISTER}><Button type="primary">Đăng ký</Button></Link>
                    </Space>
                ) : (
                    <Space size="large" align="center">
                        <Badge count={3} size="small">
                            <Button
                                type="text"
                                shape="circle"
                                icon={<BellOutlined style={{ color: colorTextSecondary, fontSize: '18px' }} />}
                                onClick={() => router.push(APP_ROUTES.USER.NOTIFICATIONS)}
                            />
                        </Badge>

                        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                            <div className="flex items-center gap-3 p-1 pr-3 rounded-full border border-transparent cursor-pointer transition-all hover:bg-slate-50">
                                <Avatar src={mockUser.avatar} />
                                <div className="flex flex-col leading-tight">
                                    <Text className="font-semibold text-sm">{mockUser.name}</Text>
                                    <Text type="secondary" className="text-xs">{mockUser.email}</Text>
                                </div>
                            </div>
                        </Dropdown>
                    </Space>
                )}
            </div>

            {/* ================= MOBILE: HAMBURGER BUTTON ================= */}
            <Button
                type="text"
                icon={<MenuOutlined className="text-xl" />}
                className="md:hidden flex items-center justify-center p-0"
                onClick={() => setIsMobileMenuOpen(true)}
            />

            {/* ================= MOBILE: DRAWER ================= */}
            <Drawer
                title="Menu"
                placement="right"
                onClose={() => setIsMobileMenuOpen(false)}
                open={isMobileMenuOpen}
                size="default"
                closable={{ placement: 'end' }}
                styles={
                    {
                        body: { padding: '12px 24px' }
                    }
                }
            >
                <div className="flex flex-col h-full">
                    <div className="py-2 border-b" style={{ borderColor: colorBorderSecondary, background: colorBgContainer }}>
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <Avatar size="large" src={mockUser.avatar} />
                                <div className="flex flex-col">
                                    <Text className="font-semibold text-base">{mockUser.name}</Text>
                                    <Text type="secondary" className="text-sm">{mockUser.email}</Text>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Text type="secondary">Đăng nhập để trải nghiệm tốt nhất</Text>
                                <div className="grid grid-cols-2 gap-2">
                                    <Link href={APP_ROUTES.AUTH.LOGIN}>
                                        <Button block>Đăng nhập</Button>
                                    </Link>
                                    <Link href={APP_ROUTES.AUTH.REGISTER}>
                                        <Button type="primary" block>Đăng ký</Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 👇 ĐÃ REFACTOR: Trực tiếp dùng Antd Menu và chuẩn hóa khoảng cách */}
                    <div className="py-2 flex-1 overflow-y-auto">
                        <Menu
                            mode="inline"
                            selectedKeys={[activeNavKey]}
                            items={mainNavItems}
                            style={{ borderRight: 'none' }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {isAuthenticated && (
                            <>
                                {/* Dùng Divider chuẩn với margin mặc định để cân đối 2 bên */}
                                <Divider style={{ margin: '8px 0' }} />

                                <Menu
                                    mode="inline"
                                    selectedKeys={[pathname]}
                                    items={userMenuItems}
                                    style={{ borderRight: 'none' }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                />
                            </>
                        )}
                    </div>
                </div>
            </Drawer>
        </AntdHeader>
    );
}