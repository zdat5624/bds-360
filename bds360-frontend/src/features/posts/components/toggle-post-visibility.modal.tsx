// @/features/posts/components/toggle-post-visibility.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getErrorMessage } from '@/utils/error.util';
import { EyeInvisibleOutlined, EyeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { App, Button, Flex, Typography } from 'antd';
import { useTogglePostVisibility } from '../api/posts.mutations';
import { Post } from '../api/types';

const { Text, Paragraph } = Typography;

interface TogglePostVisibilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
}

export function TogglePostVisibilityModal({ isOpen, onClose, post }: TogglePostVisibilityModalProps) {
    const { message } = App.useApp();
    const { colorWarning } = useAppTheme();

    // Sử dụng mutation đã tạo
    const { mutate: toggleVisibility, isPending } = useTogglePostVisibility();

    if (!post) return null;

    const isHiding = !post.isHidden; // Nếu hiện tại đang hiện (!isHidden) -> Hành động tiếp theo là Ẩn

    const handleConfirm = () => {
        toggleVisibility(
            { id: post.id, isHidden: isHiding },
            {
                onSuccess: () => {
                    message.success(isHiding ? 'Đã tạm ẩn tin đăng thành công' : 'Đã hiển thị lại tin đăng thành công');
                    onClose();
                },
                onError: (error) => {
                    message.error(getErrorMessage(error));
                }
            }
        );
    };

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <Flex align="center" gap={8}>
                    <QuestionCircleOutlined style={{ color: colorWarning }} />
                    <span>Xác nhận {isHiding ? 'tạm ẩn' : 'hiển thị'} tin đăng</span>
                </Flex>
            }
            width={450}
            footer={null} // Tùy chỉnh nút ở dưới cho đẹp
        >
            <div className="flex flex-col gap-4">
                <Paragraph>
                    Bạn có chắc chắn muốn {isHiding ? <Text strong type="warning">tạm ẩn</Text> : <Text strong color="processing">hiển thị lại</Text>} tin đăng:
                    <br />
                    <Text strong>{`"${post.title}"`}</Text>?
                </Paragraph>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <Text type="secondary" className="text-sm">
                        {isHiding
                            ? 'Lưu ý: Khi ẩn tin, người dùng khác sẽ không thể tìm thấy hoặc xem nội dung bài viết này cho đến khi bạn bật hiển thị lại.'
                            : 'Lưu ý: Tin đăng của bạn sẽ xuất hiện công khai trở lại trên hệ thống và kết quả tìm kiếm.'}
                    </Text>
                </div>

                <Flex justify="end" gap={12} className="mt-2">
                    <Button onClick={onClose} disabled={isPending}>
                        Hủy bỏ
                    </Button>
                    <Button
                        type="primary"
                        loading={isPending}
                        onClick={handleConfirm}
                        icon={isHiding ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        className={isHiding ? '!bg-amber-500 hover:!bg-amber-400 border-none' : ''}
                    >
                        Xác nhận {isHiding ? 'Ẩn tin' : 'Hiện tin'}
                    </Button>
                </Flex>
            </div>
        </AppModal>
    );
}