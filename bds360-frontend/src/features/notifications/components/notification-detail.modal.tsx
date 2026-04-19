// @/features/notifications/components/notification-detail.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatDateTime } from '@/utils';
import { Descriptions, Tag } from 'antd';
import { Notification } from '../api/types';
import {
    NOTIFICATION_TYPE_ICON,
    NOTIFICATION_TYPE_LABEL
} from '../notifications.constant';

interface NotificationDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    notification: Notification | null;
}

export function NotificationDetailModal({ isOpen, onClose, notification }: NotificationDetailModalProps) {
    const { colorTextSecondary, colorText } = useAppTheme();

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            title="Chi tiết thông báo"
            width={550} // Kích thước vừa phải vì thông báo thường không quá dài
        >
            {/* Render dữ liệu luôn vì đã có sẵn object truyền vào từ list */}
            {notification && (
                <Descriptions
                    bordered
                    column={1}
                    size="middle"
                    styles={{
                        label: { width: '140px', color: colorTextSecondary },
                        content: { fontWeight: 500, color: colorText }
                    }}
                >
                    <Descriptions.Item label="Phân loại">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center" style={{ color: colorTextSecondary }}>
                                {NOTIFICATION_TYPE_ICON[notification.type]}
                            </span>
                            {NOTIFICATION_TYPE_LABEL[notification.type]}
                        </div>
                    </Descriptions.Item>

                    <Descriptions.Item label="Trạng thái">
                        {/* Dùng màu mặc định của Antd cho trạng thái */}
                        <Tag
                            color={notification.read ? 'success' : 'processing'}
                            variant="filled"
                        >
                            {notification.read ? 'Đã đọc' : 'Chưa đọc'}
                        </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Thời gian">
                        {formatDateTime(notification.createdAt)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Nội dung">
                        {/* Nội dung thông báo thường dài nên để font-weight 400 và pre-wrap để giữ format xuống dòng nếu có */}
                        <span style={{ fontWeight: 400, whiteSpace: 'pre-wrap' }}>
                            {notification.message}
                        </span>
                    </Descriptions.Item>
                </Descriptions>
            )}
        </AppModal>
    );
}