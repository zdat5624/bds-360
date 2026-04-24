import {
    AppstoreOutlined,
    BellOutlined,
    ContainerOutlined,
    CreditCardOutlined,
    CrownOutlined,
    DashboardOutlined,
    FileTextOutlined,
    IdcardOutlined,
    KeyOutlined,
    // 🌟 Thêm các icon mới phục vụ cho mục Thống kê
    LineChartOutlined,
    PieChartOutlined,
    PlusCircleOutlined,
    TeamOutlined,
    TransactionOutlined,
    UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Link from 'next/link';

import { ADMIN_ONLY_ROUTES } from '@/config/auth-guard.config';
import { APP_ROUTES } from '@/config/routes';
import { Role } from './role.constant';

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
        key: APP_ROUTES.USER.CREATE_POST,
        icon: <PlusCircleOutlined />,
        label: <Link href={APP_ROUTES.USER.CREATE_POST}>Đăng tin mới</Link>,
    },
    {
        key: APP_ROUTES.USER.MY_POSTS,
        icon: <FileTextOutlined />,
        label: <Link href={APP_ROUTES.USER.MY_POSTS}>Quản lý tin đăng</Link>,
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
];

// ==========================================
// 2. MENU DÀNH CHO QUẢN TRỊ VIÊN (Back-office)
// ==========================================
export const MANAGE_MENU_ITEMS: MenuProps['items'] = [
    {
        key: APP_ROUTES.MANAGE.DASHBOARD,
        icon: <DashboardOutlined />,
        label: <Link href={APP_ROUTES.MANAGE.DASHBOARD}>Tổng quan hệ thống</Link>,
    },

    {
        key: 'statistics-group',
        icon: <LineChartOutlined />,
        label: 'Thống kê & Báo cáo',
        children: [
            {
                key: APP_ROUTES.MANAGE.STATISTICS.USERS,
                icon: <PieChartOutlined />,
                label: <Link href={APP_ROUTES.MANAGE.STATISTICS.USERS}>Thống kê người dùng</Link>,
            },
            {
                key: APP_ROUTES.MANAGE.STATISTICS.POSTS,
                icon: <ContainerOutlined />,
                label: <Link href={APP_ROUTES.MANAGE.STATISTICS.POSTS}>Thống kê tin đăng</Link>,
            },
            {
                key: APP_ROUTES.MANAGE.STATISTICS.TRANSACTIONS,
                icon: <TransactionOutlined />,
                label: <Link href={APP_ROUTES.MANAGE.STATISTICS.TRANSACTIONS}>Dòng tiền</Link>,
            },
        ],
    },

    {
        key: APP_ROUTES.MANAGE.USERS,
        icon: <TeamOutlined />,
        label: <Link href={APP_ROUTES.MANAGE.USERS}>Quản lý người dùng</Link>,
    },

    {
        key: APP_ROUTES.MANAGE.VERIFICATIONS,
        icon: <IdcardOutlined />,
        label: <Link href={APP_ROUTES.MANAGE.VERIFICATIONS}>Duyệt xác thực</Link>,
    },
    {
        key: APP_ROUTES.MANAGE.TRANSACTIONS,
        icon: <TransactionOutlined />, // Có thể đổi sang CreditCardOutlined nếu bị trùng icon với Dòng tiền
        label: <Link href={APP_ROUTES.MANAGE.TRANSACTIONS}>Quản lý giao dịch</Link>,
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
        key: APP_ROUTES.MANAGE.VIPS,
        icon: <CrownOutlined />,
        label: <Link href={APP_ROUTES.MANAGE.VIPS}>Quản lý gói VIP</Link>,
    },
];



export const getPageMeta = (key: string): { icon: React.ReactNode; title: string } => {
    const findMeta = (items: any[], searchKey: string): { icon: React.ReactNode; title: string } | null => {
        if (!items) return null;

        for (const item of items) {
            if (item?.key === searchKey) {
                // Rút trích chuỗi text bên trong thẻ <Link> hoặc text thường
                const title = item.label?.props?.children || (typeof item.label === 'string' ? item.label : '');
                return { icon: item.icon, title };
            }

            if (item?.children) {
                const found = findMeta(item.children, searchKey);
                if (found) return found;
            }
        }
        return null;
    };

    const foundMeta = findMeta(MANAGE_MENU_ITEMS as any[], key) || findMeta(USER_MENU_ITEMS as any[], key);
    return foundMeta || { icon: null, title: 'BDS 360' };
};

/**
 * Lọc menu dựa trên Role và ADMIN_ONLY_ROUTES
 */
export const getFilteredManageMenu = (role: Role | undefined) => {
    if (!role || role === 'USER') return [];
    if (role === 'ADMIN') return MANAGE_MENU_ITEMS;

    if (role === 'MODERATOR') {
        return MANAGE_MENU_ITEMS?.filter((item: any) => {
            // 1. Nếu menu cha nằm trong danh sách cấm -> Loại bỏ luôn
            if (ADMIN_ONLY_ROUTES.includes(item.key)) return false;

            // 2. Nếu là nhóm có menu con (ví dụ: statistics-group)
            if (item.children) {
                const filteredChildren = item.children.filter(
                    (child: any) => !ADMIN_ONLY_ROUTES.includes(child.key)
                );

                // Nếu nhóm cha không bị cấm, nhưng toàn bộ con bị cấm -> Ẩn luôn cha
                if (filteredChildren.length === 0) return false;

                // Cập nhật lại danh sách con (Dùng spread để tránh thay đổi trực tiếp hỏng menu gốc)
                return { ...item, children: filteredChildren };
            }

            return true;
        });
    }

    return [];
};