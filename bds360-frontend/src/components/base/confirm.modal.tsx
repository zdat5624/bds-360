// @/components/base/confirm.modal.tsx
'use client';

import { useAppTheme } from '@/hooks/use-app-theme';
import { ExclamationCircleFilled } from '@ant-design/icons';
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
    isDanger?: boolean;
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
    const { colorError, colorWarning, colorTextSecondary } = useAppTheme();

    return (
        <Modal
            open={isOpen}
            onOk={onConfirm}
            onCancel={!isLoading ? onClose : undefined}
            okText={okText}
            cancelText={cancelText}
            confirmLoading={isLoading}
            okButtonProps={{ danger: isDanger }}
            cancelButtonProps={{ disabled: isLoading }}
            centered
            width={400}
            mask={{ closable: !isLoading }}
            closable={!isLoading}
            destroyOnHidden
        >
            {/* 👇 Cấu trúc Layout Mới: Icon trái, Text phải */}
            <div className="flex items-start gap-4 pt-4 pb-2">
                <ExclamationCircleFilled
                    className="mt-1"
                    style={{
                        fontSize: 16, // Chỉnh nhỏ lại cho phù hợp layout ngang
                        color: isDanger ? colorError : colorWarning,
                    }}
                />
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