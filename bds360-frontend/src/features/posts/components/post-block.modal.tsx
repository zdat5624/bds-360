// @/features/posts/components/post-block.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { Post, POST_STATUS_COLOR, POST_STATUS_LABEL } from '@/features/posts';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getErrorMessage } from '@/utils/error.util';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Button, Form, Input, Switch, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useUpdatePostStatus } from '../api/posts.mutations';
import { UpdatePostStatusFormValues, updatePostStatusSchema } from '../posts.schema';

const { Text } = Typography;

interface PostBlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
}

export function PostBlockModal({ isOpen, onClose, post }: PostBlockModalProps) {
    const { message } = App.useApp();
    const { colorBgContainer, colorBorderSecondary } = useAppTheme();
    const { mutateAsync: updatePostStatus, isPending } = useUpdatePostStatus();

    const [customMessageEnabled, setCustomMessageEnabled] = useState(true); // Khóa bài thường bắt buộc ghi lý do

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<UpdatePostStatusFormValues>({
        resolver: zodResolver(updatePostStatusSchema),
        defaultValues: {
            postId: 0,
            status: 'BLOCKED',
            message: '',
            sendNotification: true,
        },
    });

    const isSendingNotification = watch('sendNotification');
    const currentCustomMessage = watch('message');

    useEffect(() => {
        if (isOpen && post) {
            reset({
                postId: post.id,
                status: 'BLOCKED',
                message: '',
                sendNotification: true,
            });
            setCustomMessageEnabled(true);
        }
    }, [isOpen, post, reset]);

    const getDefaultMessage = () => {
        const postId = post?.id || '?';
        return `Tin đăng mã '${postId}' của bạn đã bị khóa do vi phạm tiêu chuẩn cộng đồng`;
    };

    const getFinalMessage = () => {
        const defaultMessage = getDefaultMessage();
        return customMessageEnabled && currentCustomMessage?.trim()
            ? `${defaultMessage}. Lý do: ${currentCustomMessage.trim()}`
            : defaultMessage;
    };

    const onSubmit: SubmitHandler<UpdatePostStatusFormValues> = async (data) => {
        try {
            // Khi khóa bài, nên khuyến khích/bắt buộc Admin nhập lý do rõ ràng
            if (customMessageEnabled && data.sendNotification && !data.message?.trim()) {
                message.error('Vui lòng nhập lý do khóa bài viết để thông báo cho người dùng');
                return;
            }

            const finalPayload = {
                ...data,
                message: data.sendNotification ? getFinalMessage() : undefined,
                sendNotification: Boolean(data.sendNotification),
            };

            await updatePostStatus(finalPayload);
            message.success('Khóa tin đăng thành công!');
            onClose();
        } catch (error) {
            message.error(getErrorMessage(error) || 'Có lỗi xảy ra');
        }
    };

    return (
        <AppModal
            title={
                <div className="flex justify-between items-center w-full pr-8">
                    <span className="text-red-600">Khóa tin đăng #{post?.id || '?'}</span>
                    <div className="flex items-center gap-2 font-normal text-sm text-gray-800">
                        <Text>Gửi thông báo</Text>
                        <Switch
                            checked={isSendingNotification}
                            onChange={(checked) => {
                                setValue('sendNotification', checked);
                                if (!checked) {
                                    setCustomMessageEnabled(false);
                                    setValue('message', '');
                                } else {
                                    setCustomMessageEnabled(true);
                                }
                            }}
                            size="small"
                        />
                    </div>
                </div>
            }
            isOpen={isOpen}
            onClose={onClose}
            width={600}
            isLoading={isPending}
        >
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-2 font-medium">Trạng thái hiện tại</label>
                        {post?.status && (
                            <Tag color={POST_STATUS_COLOR[post.status]} className="text-sm px-3 py-1">
                                {POST_STATUS_LABEL[post.status]}
                            </Tag>
                        )}
                    </div>

                    {isSendingNotification && (
                        <div className="flex flex-col gap-4 border-t pt-4" style={{ borderColor: colorBorderSecondary }}>
                            <div>
                                <label className="block mb-2 font-medium text-red-600">Lý do khóa bài (Bắt buộc)</label>
                                <Form.Item
                                    validateStatus={errors.message ? 'error' : ''}
                                    help={errors.message?.message as string}
                                    className="!mb-0"
                                >
                                    <Controller
                                        name="message"
                                        control={control}
                                        rules={{ required: isSendingNotification && customMessageEnabled }}
                                        render={({ field }) => (
                                            <Input.TextArea
                                                {...field}
                                                rows={3}
                                                placeholder="Nhập lý do vi phạm (VD: Chứa hình ảnh không hợp lệ, sai sự thật...)"
                                            />
                                        )}
                                    />
                                </Form.Item>
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">Nội dung gửi đến người dùng (Xem trước)</label>
                                <div
                                    className="p-3 rounded-lg text-sm"
                                    style={{ backgroundColor: colorBgContainer, border: `1px solid ${colorBorderSecondary}` }}
                                >
                                    <Text type="danger">{getFinalMessage()}</Text>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button onClick={onClose} disabled={isPending}>Hủy</Button>
                    <Button danger type="primary" htmlType="submit" loading={isPending}>
                        Xác nhận Khóa
                    </Button>
                </div>
            </Form>
        </AppModal>
    );
}