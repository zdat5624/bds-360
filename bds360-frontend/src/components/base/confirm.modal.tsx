// @/components/base/confirm.modal.tsx
'use client';

import { useAppTheme } from '@/hooks/use-app-theme';
import { ExclamationCircleFilled, InfoCircleFilled } from '@ant-design/icons';
import { Modal, Typography } from 'antd';
import { ReactNode } from 'react';

const { Text } = Typography;

//  Định nghĩa các loại Confirm
export type ConfirmType = 'warning' | 'danger' | 'info';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    content?: ReactNode;
    okText?: string;
    cancelText?: string;
    type?: ConfirmType; //  Thay thế isDanger bằng type
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    content,
    okText = 'Xác nhận',
    cancelText = 'Hủy',
    type = 'warning', // Mặc định vẫn là cảnh báo (vàng)
    isLoading = false,
}: ConfirmModalProps) {
    // Lấy màu từ theme để đồng bộ toàn app
    const { colorError, colorWarning, colorInfo, colorTextSecondary } = useAppTheme();

    //  Hàm helper để render Icon và Màu sắc tương ứng theo type
    const getModalConfig = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: <ExclamationCircleFilled />,
                    color: colorError,
                    okDanger: true,
                };
            case 'info':
                return {
                    icon: <InfoCircleFilled />,
                    color: colorInfo, // Hoặc colorPrimary tùy hệ thống màu của bạn
                    okDanger: false,
                };
            case 'warning':
            default:
                return {
                    icon: <ExclamationCircleFilled />,
                    color: colorWarning,
                    okDanger: false,
                };
        }
    };

    const config = getModalConfig();

    return (
        <Modal
            open={isOpen}
            onOk={onConfirm}
            onCancel={!isLoading ? onClose : undefined}
            okText={okText}
            cancelText={cancelText}
            confirmLoading={isLoading}
            okButtonProps={{ danger: config.okDanger }} // Tự động set màu đỏ cho nút OK nếu là danger
            cancelButtonProps={{ disabled: isLoading }}
            centered
            width={400}
            mask={{ closable: !isLoading }}
            closable={!isLoading}
            destroyOnHidden
        >
            <div className="flex items-start gap-4 pt-4 pb-2">
                {/*  Render Icon linh hoạt */}
                <span
                    className="mt-1"
                    style={{
                        fontSize: 20, // Tăng nhẹ size icon lên 20 nhìn sẽ cân đối hơn với Title
                        color: config.color,
                    }}
                >
                    {config.icon}
                </span>

                <div className="flex-1 text-left">
                    <h3 className="text-base font-bold m-0 mb-1">
                        {title}
                    </h3>
                    {content && (
                        <div className="mt-1">
                            {typeof content === 'string' ? (
                                <Text style={{ color: colorTextSecondary }}>{content}</Text>
                            ) : (
                                content
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}