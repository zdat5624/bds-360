// @/features/users/components/user-delete.modal.tsx
'use client';

import { ConfirmModal } from '@/components/base/confirm.modal';
import { getErrorMessage } from '@/utils';
import { App } from 'antd';
import { useDeleteUser } from '../api/user.mutations';

interface UserDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: number | null;
}

export function UserDeleteModal({ isOpen, onClose, userId }: UserDeleteModalProps) {
    const { message } = App.useApp();
    const { mutateAsync: deleteUser, isPending } = useDeleteUser();

    const handleDelete = async () => {
        if (!userId) return;
        try {
            await deleteUser(userId);
            message.success('Đã xóa người dùng thành công');
            onClose();
        } catch (error) {

            message.error(getErrorMessage(error) || 'Xóa người dùng thất bại!');
        }
    };

    return (
        <ConfirmModal
            isOpen={isOpen}
            title="Xác nhận xóa người dùng"
            content="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác và sẽ ảnh hưởng đến các dữ liệu liên quan."
            type="danger"
            isLoading={isPending}
            onConfirm={handleDelete}
            onClose={onClose}
            okText="Xóa ngay"
        />
    );
}