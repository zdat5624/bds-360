// @/features/posts/components/post-approval.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { Post, POST_STATUS_COLOR, POST_STATUS_LABEL, UpdatePostStatusFormValues, updatePostStatusSchema } from '@/features/posts';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getErrorMessage } from '@/utils/error.util';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Button, Form, Input, Radio, Switch, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useUpdatePostStatus } from '../api/posts.mutations';

const { Text } = Typography;

interface PostApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
}

export function PostApprovalModal({ isOpen, onClose, post }: PostApprovalModalProps) {
    const { message } = App.useApp();
    const { colorBgContainer, colorBorderSecondary } = useAppTheme();
    const { mutateAsync: updatePostStatus, isPending } = useUpdatePostStatus();

    const [customMessageEnabled, setCustomMessageEnabled] = useState(false);

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
            status: undefined, // Đã fix: Trả về undefined để không auto-check
            message: '',
            sendNotification: true,
        },
    });

    const currentStatus = watch('status');
    const isSendingNotification = watch('sendNotification');
    const currentCustomMessage = watch('message');

    useEffect(() => {
        if (isOpen && post) {
            reset({
                postId: post.id,
                status: undefined, // Đã fix: Đảm bảo khi mở lại modal khác, nó cũng bị làm trống
                message: '',
                sendNotification: true,
            });
            setCustomMessageEnabled(false);
        }
    }, [isOpen, post, reset]);

    const getDefaultMessage = (status: string, action: string) => {
        const postId = post?.id || '?';
        if (action === 'APPROVED') {
            switch (status) {
                case 'PENDING':
                    return `Tin đăng mã '${postId}' của bạn đã được quản trị viên duyệt và hiện đã được hiển thị`;
                case 'REVIEW_LATER':
                    return `Tin đăng mã '${postId}' của bạn đã được quản trị viên xác thực lại và hiện đang tiếp tục hiển thị`;
                case 'REJECTED':
                    return `Tin đăng mã '${postId}' của bạn đã được quản trị viên duyệt lại và hiện đang được hiển thị`;
                default:
                    return '';
            }
        } else if (action === 'REJECTED') {
            return `Tin đăng mã '${postId}' của bạn đã bị quản trị viên từ chối hiển thị, vui lòng kiểm tra lại`;
        }
        return '';
    };

    const getFinalMessage = () => {
        if (!currentStatus) return 'Vui lòng chọn hành động để xem tin nhắn';
        const defaultMessage = getDefaultMessage(post?.status || '', currentStatus);
        return customMessageEnabled && currentCustomMessage?.trim()
            ? `${defaultMessage}. ${currentCustomMessage.trim()}`
            : defaultMessage;
    };

    const onSubmit: SubmitHandler<UpdatePostStatusFormValues> = async (data) => {
        try {
            if (!data.status) {
                message.error('Vui lòng chọn hành động Chấp nhận hoặc Từ chối!');
                return;
            }

            if (customMessageEnabled && data.sendNotification && !data.message?.trim()) {
                message.error('Vui lòng nhập nội dung tùy chỉnh nếu gửi thông báo');
                return;
            }

            const finalPayload = {
                ...data,
                message: data.sendNotification ? getFinalMessage() : undefined,
                sendNotification: Boolean(data.sendNotification),
            };

            await updatePostStatus(finalPayload);
            message.success('Cập nhật trạng thái tin đăng thành công!');
            onClose();
        } catch (error) {
            message.error(getErrorMessage(error) || 'Có lỗi xảy ra');
        }
    };

    const isApproveDisabled = !['PENDING', 'REVIEW_LATER', 'REJECTED'].includes(post?.status || '');
    const isRejectDisabled = !['PENDING', 'REVIEW_LATER', 'APPROVED'].includes(post?.status || '');

    return (
        <AppModal
            title={
                <div className="flex justify-between items-center w-full pr-8">
                    <span>Duyệt tin đăng #{post?.id || '?'}</span>
                    <div className="flex items-center gap-2 font-normal text-sm">
                        <Text>Gửi thông báo</Text>
                        <Switch
                            checked={isSendingNotification}
                            onChange={(checked) => {
                                setValue('sendNotification', checked);
                                if (!checked) {
                                    setCustomMessageEnabled(false);
                                    setValue('message', '');
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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-medium">Trạng thái hiện tại</label>
                            {post?.status && (
                                <Tag color={POST_STATUS_COLOR[post.status]} className="text-sm px-3 py-1">
                                    {POST_STATUS_LABEL[post.status]}
                                </Tag>
                            )}
                        </div>
                        <Form.Item
                            label={<span className="font-medium">Hành động</span>}
                            validateStatus={errors.status ? 'error' : ''}
                            help={errors.status?.message as string}
                            className="!mb-0"
                        >
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Radio.Group {...field} optionType="button" buttonStyle="solid">
                                        <Radio.Button
                                            value="APPROVED"
                                            disabled={isApproveDisabled}
                                            className={field.value === 'APPROVED' ? '!bg-green-500 !text-white !border-green-500' : ''}
                                        >
                                            Chấp nhận
                                        </Radio.Button>
                                        <Radio.Button
                                            value="REJECTED"
                                            disabled={isRejectDisabled}
                                            className={field.value === 'REJECTED' ? '!bg-red-500 !text-white !border-red-500' : ''}
                                        >
                                            Từ chối
                                        </Radio.Button>
                                    </Radio.Group>
                                )}
                            />
                        </Form.Item>
                    </div>

                    {isSendingNotification && (
                        <div className="flex flex-col gap-4 border-t pt-4" style={{ borderColor: colorBorderSecondary }}>
                            <div>
                                <label className="block mb-2 font-medium">Nội dung thông báo (Xem trước)</label>
                                <div
                                    className="p-3 rounded-lg text-sm"
                                    style={{ backgroundColor: colorBgContainer, border: `1px solid ${colorBorderSecondary}` }}
                                >
                                    <Text>{getFinalMessage()}</Text>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={customMessageEnabled}
                                    onChange={(checked) => {
                                        setCustomMessageEnabled(checked);
                                        if (!checked) setValue('message', '');
                                    }}
                                    size="small"
                                />
                                <Text>Thêm tin nhắn tùy chỉnh</Text>
                            </div>

                            {customMessageEnabled && (
                                <Form.Item
                                    validateStatus={errors.message ? 'error' : ''}
                                    help={errors.message?.message as string}
                                    className="!mb-0"
                                >
                                    <Controller
                                        name="message"
                                        control={control}
                                        render={({ field }) => (
                                            <Input.TextArea
                                                {...field}
                                                rows={3}
                                                placeholder="Nhập nội dung tùy chỉnh (sẽ được nối với tin nhắn mặc định)"
                                            />
                                        )}
                                    />
                                </Form.Item>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button onClick={onClose} disabled={isPending}>Hủy</Button>
                    <Button type="primary" htmlType="submit" loading={isPending} disabled={!currentStatus}>
                        Xác nhận
                    </Button>
                </div>
            </Form>
        </AppModal>
    );
}