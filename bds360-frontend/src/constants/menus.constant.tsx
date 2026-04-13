// @/constants/menus.constant.tsx
import {
    AppstoreOutlined,
    BellOutlined,
    CreditCardOutlined,
    CrownOutlined,
    DashboardOutlined,
    FileTextOutlined,
    KeyOutlined,
    PlusCircleOutlined,
    TeamOutlined,
    TransactionOutlined,
    UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Link from 'next/link';

import { APP_ROUTES } from '@/config/routes';

// ==========================================
// 1. MENU DÀNH CHO USER (Khách hàng)
// ==========================================
export const USER_MENU_ITEMS: MenuProps['items'] = [
    {
        key: APP_ROUTES.USER.DASH_BOARD,
        icon: <DashboardOutlined />,
        label: <Link href={APP_ROUTES.USER.DASH_BOARD}>Bảng điều khiển</Link>,
    },
    {
        key: APP_ROUTES.USER.PROFILE,
        icon: <UserOutlined />,
        label: <Link href={APP_ROUTES.USER.PROFILE}>Thông tin cá nhân</Link>,
    },
    {
        key: APP_ROUTES.USER.CHANGE_PASSWORD,
        icon: <KeyOutlined />,
        label: <Link href={APP_ROUTES.USER.CHANGE_PASSWORD}>Đổi mật khẩu</Link>,
    },
    {
        key: APP_ROUTES.USER.MY_POSTS,
        icon: <FileTextOutlined />,
        label: <Link href={APP_ROUTES.USER.MY_POSTS}>Quản lý tin đăng</Link>,
    },
    {
        key: APP_ROUTES.USER.CREATE_POST,
        icon: <PlusCircleOutlined />,
        label: <Link href={APP_ROUTES.USER.CREATE_POST}>Đăng tin mới</Link>,
    },
    {
        key: APP_ROUTES.USER.NOTIFICATIONS,
        icon: <BellOutlined />,
        label: <Link href={APP_ROUTES.USER.NOTIFICATIONS}>Thông báo</Link>,
    },
    {
        key: APP_ROUTES.USER.PAYMENTS,
        icon: <CreditCardOutlined />,
        label: <Link href={APP_ROUTES.USER.PAYMENTS}>Lịch sử giao dịch</Link>,
    },
    {
        key: APP_ROUTES.USER.VIPS,
        icon: <CrownOutlined />,
        label: <Link href={APP_ROUTES.USER.VIPS}>Gói VIP</Link>,
    },
];

// ==========================================
// 2. MENU DÀNH CHO QUẢN TRỊ VIÊN (Back-office)
// ==========================================
export const MANAGE_MENU_ITEMS: MenuProps['items'] = [
    {
        key: APP_ROUTES.MANAGE.DASHBOARD,
        icon: <DashboardOutlined />,
        label: <Link href={APP_ROUTES.MANAGE.DASHBOARD}>Tổng quan</Link>,
    },
    {
        key: APP_ROUTES.MANAGE.USERS,
        icon: <TeamOutlined />,
        label: <Link href={APP_ROUTES.MANAGE.USERS}>Quản lý tài khoản</Link>,
    },
    {
        key: APP_ROUTES.MANAGE.POSTS,
        icon: <FileTextOutlined />,
        label: <Link href={APP_ROUTES.MANAGE.POSTS}>Quản lý tin đăng</Link>,
    },
    {
        key: APP_ROUTES.MANAGE.CATEGORIES,
        icon: <AppstoreOutlined />,
        label: <Link href={APP_ROUTES.MANAGE.CATEGORIES}>Quản lý danh mục</Link>,
    },
    {
        key: APP_ROUTES.MANAGE.PAYMENTS,
        icon: <TransactionOutlined />,
        label: <Link href={APP_ROUTES.MANAGE.PAYMENTS}>Quản lý giao dịch</Link>,
    },
    {
        key: APP_ROUTES.MANAGE.VIPS,
        icon: <CrownOutlined />,
        label: <Link href={APP_ROUTES.MANAGE.VIPS}>Quản lý gói VIP</Link>,
    },
];