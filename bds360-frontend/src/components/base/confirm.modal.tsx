// @/components/base/confirm.modal.tsx
'use client';

import { useAppTheme } from '@/hooks/use-app-theme';
import { Modal, Typography } from 'antd';
import { ReactNode } from 'react';

const { Text } = Typography;

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    content?: ReactNode;
    okText?: string;
    cancelText?: string;
    isDanger?: boolean; // Tự động đổi nút OK thành màu đỏ cảnh báo
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
    isDanger = false,
    isLoading = false,
}: ConfirmModalProps) {
    const { colorTextSecondary } = useAppTheme();

    return (
        <Modal
            title={title}
            open={isOpen}
            onOk={onConfirm}
            onCancel={onClose}
            okText={okText}
            cancelText={cancelText}
            confirmLoading={isLoading}
            okButtonProps={{ danger: isDanger }}
            centered
            // 👇 Cập nhật API mới nhất của Ant Design, loại bỏ maskClosable
            mask={{ closable: !isLoading }}
            closable={!isLoading}
        >
            {content && (
                <div className="mt-2">
                    {typeof content === 'string' ? (
                        <Text style={{ color: colorTextSecondary }}>{content}</Text>
                    ) : (
                        content
                    )}
                </div>
            )}
        </Modal>
    );
}