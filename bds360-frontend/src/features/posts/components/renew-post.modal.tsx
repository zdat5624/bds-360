// @/features/posts/components/renew-post.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { useGetVips } from '@/features/vips/api/vips.queries'; // 🌟 Import lại useGetVips
import { formatCurrency } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Button, Form, InputNumber, Skeleton, Typography } from 'antd';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRenewPost } from '../api/posts.mutations';
import { Post } from '../api/types';
import { RenewPostFormValues, renewPostSchema } from '../posts.schema';

const { Text, Title } = Typography;

interface RenewPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
}

export function RenewPostModal({ isOpen, onClose, post }: RenewPostModalProps) {
    const { message } = App.useApp();
    const renewPostMutation = useRenewPost();

    // 🌟 Gọi API lấy danh sách VIP để tra cứu giá
    const { data: vipsData, isLoading: isLoadingVips } = useGetVips();

    const { control, handleSubmit, watch, reset } = useForm<RenewPostFormValues>({
        resolver: zodResolver(renewPostSchema),
        defaultValues: {
            id: 0,
            numberOfDays: 7,
        },
    });

    const watchDays = watch('numberOfDays') || 0;

    useEffect(() => {
        if (isOpen && post) {
            reset({
                id: post.id,
                numberOfDays: 7,
            });
        }
    }, [isOpen, post, reset]);

    // 🌟 TÌM GÓI VIP TRONG DANH SÁCH VÀ LẤY GIÁ
    const currentVip = vipsData?.find(v => v.id === post?.vip?.id);
    const currentVipPrice = currentVip?.pricePerDay || 0;

    const totalCost = currentVipPrice * watchDays;

    const onSubmit = async (values: RenewPostFormValues) => {
        try {
            await renewPostMutation.mutateAsync(values);
            message.success('Đã gia hạn tin đăng thành công!');
            onClose();
        } catch (error) {
            console.error('Lỗi gia hạn:', error);
        }
    };

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            title="Gia hạn tin đăng"
            width={450}
            isLoading={renewPostMutation.isPending}
        >
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="mt-2 flex flex-col gap-2">
                <div className="p-3 mb-2 rounded-lg bg-gray-50 border border-gray-200">
                    <Text className="text-xs text-gray-500 uppercase tracking-wider">Tin đang chọn:</Text>
                    <Title level={5} className="!m-0 !mt-1 line-clamp-2">{post?.title}</Title>
                    {post?.expireDate && (
                        <Text className="text-xs text-red-500 block mt-1">
                            Ngày hết hạn hiện tại: {new Date(post.expireDate).toLocaleDateString('vi-VN')}
                        </Text>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item label={<span className="font-medium">Số ngày gia hạn</span>} required>
                        <Controller
                            name="numberOfDays"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <InputNumber
                                        {...field}
                                        min={1}
                                        max={365}
                                        className="w-full"
                                        size="large"
                                        placeholder="Ví dụ: 7"
                                        status={fieldState.error ? 'error' : ''}
                                    />
                                    {fieldState.error && (
                                        <Text type="danger" className="text-xs mt-1 block">
                                            {fieldState.error.message}
                                        </Text>
                                    )}
                                </>
                            )}
                        />
                    </Form.Item>

                    <Form.Item label={<span className="font-medium">Gói hiển thị hiện tại</span>}>
                        <div className="flex flex-col justify-center px-3 h-10 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed">
                            <Text strong className="text-sm truncate">
                                {post?.vip?.name || 'Đang tải...'}
                            </Text>
                        </div>
                    </Form.Item>
                </div>

                <div className="flex justify-between items-center p-4 rounded-lg bg-orange-50 border border-orange-200 mt-2">
                    <div className="flex flex-col">
                        <Text className="font-semibold text-orange-800 uppercase tracking-wider text-xs">Tổng thanh toán</Text>
                        {isLoadingVips ? (
                            <Skeleton.Button active size="small" className="mt-1 !h-3 !w-24" />
                        ) : (
                            <Text className="text-[10px] text-orange-600 mt-0.5">
                                ({watchDays} ngày × {formatCurrency(currentVipPrice)}/ngày)
                            </Text>
                        )}
                    </div>
                    {isLoadingVips ? (
                        <Skeleton.Button active size="small" className="!w-24" />
                    ) : (
                        <Text className="font-bold text-xl text-orange-600">{formatCurrency(totalCost)}</Text>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={onClose} disabled={renewPostMutation.isPending}>
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={renewPostMutation.isPending}
                        disabled={!watchDays || watchDays < 1 || isLoadingVips}
                        className="font-medium"
                    >
                        Thanh toán & Gia hạn
                    </Button>
                </div>
            </Form>
        </AppModal>
    );
}