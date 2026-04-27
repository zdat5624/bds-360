// @/features/posts/components/delete-post.modal.tsx
'use client';

import { ConfirmModal } from '@/components/base/confirm.modal';
import { getErrorMessage } from '@/utils/error.util';
import { App } from 'antd';
import { useDeletePost } from '../api/posts.mutations';

interface DeletePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    postId: number | null;
    postTitle?: string;
    onSuccess?: () => void;
}

export function DeletePostModal({
    isOpen,
    onClose,
    postId,
    postTitle,
    onSuccess,
}: DeletePostModalProps) {
    const { message } = App.useApp(); // Sử dụng App.useApp() của Antd để thông báo đồng bộ với theme

    // Gọi hook xóa tin đăng (Mặc định isAdmin = false vì đây là User tự xóa)
    const { mutateAsync: deletePost, isPending } = useDeletePost(false);

    const handleConfirm = async () => {
        if (!postId) return;

        try {
            await deletePost(postId);
            message.success('Đã xóa tin đăng thành công');
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            message.error(getErrorMessage(error) || 'Có lỗi xảy ra khi xóa tin đăng');

        }
    };

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleConfirm}
            isLoading={isPending}
            title="Xác nhận xóa tin đăng"
            okText="Xóa tin"
            type='danger'
            cancelText="Hủy"
            content={
                <div className="flex flex-col gap-1">
                    <span>
                        Bạn có chắc chắn muốn ẩn tin đăng{' '}
                        {postTitle ? (
                            <span className="font-semibold text-gray-800">{postTitle}</span>
                        ) : (
                            'này'
                        )}
                        {' '}không?
                    </span>
                    <span >
                        Tin đăng sẽ bị ẩn khỏi hệ thống và không thể khôi phục.
                    </span>
                </div>
            }
        />
    );
}