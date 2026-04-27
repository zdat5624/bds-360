// @/features/posts/components/bump-post.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { formatCurrency } from '@/utils';
import { App, Button, Typography } from 'antd';
import { useBumpPost } from '../api/posts.mutations';
import { Post } from '../api/types';

const { Text, Title } = Typography;

interface BumpPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
}

export function BumpPostModal({ isOpen, onClose, post }: BumpPostModalProps) {
    const { message } = App.useApp();
    const bumpPostMutation = useBumpPost();

    // 🌟 Hardcode mức phí đẩy tin để hiện cho User (Nên đồng bộ với BE)
    const BUMP_FEE = 10000;

    const handleConfirm = async () => {
        if (!post) return;
        try {
            await bumpPostMutation.mutateAsync(post.id);
            message.success('Đã đẩy tin lên top thành công!');
            onClose();
        } catch (error) {
            console.error('Lỗi đẩy tin:', error);

        }
    };

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            title="Đẩy tin lên trang chủ"
            width={450}
            isLoading={bumpPostMutation.isPending} // Truyền isLoading vào đây, AppModal sẽ tự khóa không cho đóng
        >
            <div className="flex flex-col gap-4 py-2">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 flex flex-col gap-2">
                    <Text className="text-base font-medium">Bạn sắp đẩy tin đăng:</Text>
                    <Title level={5} className="!m-0 text-blue-700 line-clamp-2">
                        {post?.title}
                    </Title>
                </div>

                <div className="flex flex-col gap-1">
                    <Text>
                        Tin đăng của bạn sẽ được làm mới thời gian và xuất hiện ở vị trí đầu tiên trong danh mục VIP tương ứng.
                    </Text>
                    <Text type="danger" className="text-xs">
                        * Lưu ý: Mỗi tin đăng chỉ được đẩy tối đa 1 lần mỗi 2 giờ để chống spam.
                    </Text>
                </div>

                <div className="flex justify-between items-center py-3 border-t border-b mt-2">
                    <Text className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Chi phí đẩy tin</Text>
                    <Text className="font-bold text-lg text-red-600">{formatCurrency(BUMP_FEE)}</Text>
                </div>

                <div className="flex justify-end gap-2 mt-2">
                    <Button onClick={onClose} disabled={bumpPostMutation.isPending}>
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleConfirm}
                        loading={bumpPostMutation.isPending}
                        className="font-medium"
                    >
                        Xác nhận thanh toán & Đẩy tin
                    </Button>
                </div>
            </div>
        </AppModal>
    );
}