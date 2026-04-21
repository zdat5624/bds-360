// @/features/notifications/components/delete-notifications-action.tsx
'use client';

import { ConfirmModal } from '@/components/base/confirm.modal';
import { message } from 'antd';
import { ReactNode, cloneElement, isValidElement, useState } from 'react';
import { useDeleteNotifications } from '../api/notifications.mutations';

interface Props {
    ids: number[];
    onSuccess?: () => void;
    children: ReactNode;
    title?: string;
    content?: string;
}

export function DeleteNotificationsAction({
    ids,
    onSuccess,
    children,
    title = "Xác nhận xóa thông báo",
    content
}: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { mutate, isPending } = useDeleteNotifications();

    const handleConfirmDelete = () => {
        mutate(ids, {
            onSuccess: () => {
                message.success(`Đã xóa ${ids.length} thông báo`);
                setIsModalOpen(false);
                onSuccess?.();
            },
        });
    };

    const openModal = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (ids.length > 0) setIsModalOpen(true);
    };

    return (
        <>
            {isValidElement(children)
                ? cloneElement(children as any, { onClick: openModal })
                : <span onClick={openModal}>{children}</span>
            }

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={isPending}
                title={title}
                content={content || `Bạn có chắc chắn muốn xóa vĩnh viễn ${ids.length} thông báo đã chọn?`}
                okText="Xóa ngay"
                cancelText="Hủy"
                type='danger'
            />
        </>
    );
}