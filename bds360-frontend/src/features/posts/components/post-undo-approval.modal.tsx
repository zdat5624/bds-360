// @/features/posts/components/post-undo-approval.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { Post, POST_STATUS_COLOR, POST_STATUS_LABEL } from '@/features/posts';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getErrorMessage } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Button, Form, Input, Radio, Switch, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useUpdatePostStatus } from '../api/posts.mutations';
import { UpdatePostStatusFormValues, updatePostStatusSchema } from '../posts.schema';

const { Text } = Typography;

interface PostUndoApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
}

export function PostUndoApprovalModal({ isOpen, onClose, post }: PostUndoApprovalModalProps) {
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
            status: 'PENDING',
            message: '',
            sendNotification: false,
        },
    });

    const currentStatus = watch('status');
    const isSendingNotification = watch('sendNotification');
    const currentCustomMessage = watch('message');

    useEffect(() => {
        if (isOpen && post) {
            const defaultAction = post.vip?.vipLevel === 0 ? 'PENDING' : 'REVIEW_LATER';
            reset({
                postId: post.id,
                status: defaultAction,
                message: '',
                sendNotification: false,
            });
            setCustomMessageEnabled(false);
        }
    }, [isOpen, post, reset]);

    const getDefaultMessage = (action: string) => {
        const postId = post?.id || '?';
        if (action === 'PENDING') {
            return `Tin đăng mã '${postId}' của bạn đã được quản trị viên thu hồi phê duyệt để xem xét lại, trạng thái hiện tại là Chờ duyệt`;
        } else if (action === 'REVIEW_LATER') {
            return `Tin đăng mã '${postId}' của bạn đã được quản trị viên thu hồi phê duyệt để xem xét lại, trạng thái hiện tại là duyệt lại sau`;
        }
        return '';
    };

    const getFinalMessage = () => {
        if (!currentStatus) return 'Không có hành động được chọn';
        const defaultMessage = getDefaultMessage(currentStatus);
        return customMessageEnabled && currentCustomMessage?.trim()
            ? `${defaultMessage}. ${currentCustomMessage.trim()}`
            : defaultMessage;
    };

    const onSubmit: SubmitHandler<UpdatePostStatusFormValues> = async (data) => {
        try {
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
            message.success('Hoàn tác trạng thái tin đăng thành công!');
            onClose();
        } catch (error) {
            message.error(getErrorMessage(error));
        }
    };

    const isUndoDisabled = !['APPROVED', 'REJECTED'].includes(post?.status || '');

    return (
        <AppModal
            title={
                <div className="flex justify-between items-center w-full pr-8">
                    <span>Hoàn tác duyệt tin đăng #{post?.id || '?'}</span>
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
                            label={<span className="font-medium">Hoàn tác thành</span>}
                            validateStatus={errors.status ? 'error' : ''}
                            help={errors.status?.message}
                            className="!mb-0"
                        >
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Radio.Group {...field} optionType="button" buttonStyle="solid">
                                        <Radio.Button value="PENDING" className={field.value === 'PENDING' ? '!bg-yellow-500 !text-white !border-yellow-500' : ''}>Chờ duyệt</Radio.Button>
                                        <Radio.Button value="REVIEW_LATER" className={field.value === 'REVIEW_LATER' ? '!bg-orange-500 !text-white !border-orange-500' : ''}>Duyệt lại sau</Radio.Button>
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
                                    help={errors.message?.message}
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
                    <Button type="primary" htmlType="submit" loading={isPending} disabled={!currentStatus || isUndoDisabled}>
                        Xác nhận
                    </Button>
                </div>
            </Form>
        </AppModal>
    );
}