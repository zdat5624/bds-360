// @/features/notifications/notifications.constant.ts

import {
    BellOutlined,
    DollarOutlined,
    FileTextOutlined
} from '@ant-design/icons';

import React from 'react';

// 1. Khai báo các loại thông báo
export const NOTIFICATION_TYPE_VALUES = ['POST', 'TRANSACTION', 'SYSTEM_ALERT'] as const;

export type NotificationType = (typeof NOTIFICATION_TYPE_VALUES)[number];

// Options cho Select (Nếu cần lọc thông báo theo loại)
export const NOTIFICATION_TYPE_OPTIONS = Object.fromEntries(
    NOTIFICATION_TYPE_VALUES.map((item) => [item, item])
) as Record<NotificationType, NotificationType>;

// ==========================================
// BỔ SUNG: ÁNH XẠ UI (LABEL, ICON, COLOR)
// ==========================================

// 2. Map Label (Hiển thị tiếng Việt)
export const NOTIFICATION_TYPE_LABEL: Record<NotificationType, string> = {
    POST: 'Bài đăng',
    TRANSACTION: 'Giao dịch',
    SYSTEM_ALERT: 'Hệ thống',
};

// 3. Map Icon (Sử dụng Icon của Antd)
// Dùng React.ReactNode để tương thích với prop icon của Antd
export const NOTIFICATION_TYPE_ICON: Record<NotificationType, React.ReactNode> = {
    POST: <FileTextOutlined />,
    TRANSACTION: <DollarOutlined />,
    SYSTEM_ALERT: <BellOutlined />,
};
