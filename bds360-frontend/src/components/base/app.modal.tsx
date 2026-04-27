// @/components/base/app.modal.tsx
'use client';

import { Modal, ModalProps, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

interface AppModalProps extends Omit<ModalProps, 'open' | 'onCancel' | 'destroyOnClose' | 'maskClosable'> {
    isOpen: boolean;
    onClose: () => void;
    title: React.ReactNode;
    children: React.ReactNode;
    isLoading?: boolean; // Khóa Modal không cho đóng nếu đang xử lý API
}

export function AppModal({
    isOpen,
    onClose,
    title,
    children,
    isLoading = false,
    width = 650, // Chiều rộng tiêu chuẩn cho các form nhập liệu
    ...restProps
}: AppModalProps) {

    return (
        <Modal
            title={
                <Title level={4}  >
                    {title}
                </Title>
            }
            open={isOpen}
            onCancel={!isLoading ? onClose : undefined}
            width={width}
            centered

            // 👇 Tuân thủ tuyệt đối Antd v5+ (Zero Warnings)
            destroyOnHidden
            mask={{ closable: !isLoading }}
            closable={!isLoading}

            // 👇 Ẩn footer mặc định. Để các Form bên trong tự định nghĩa nút Submit/Cancel
            footer={null}

            {...restProps}
        >
            {/* Đẩy nội dung xuống một chút cho thoáng đãng chuẩn Optical Alignment */}
            <div className="!pt-1 !pb-0">
                {children}
            </div>
        </Modal>
    );
}