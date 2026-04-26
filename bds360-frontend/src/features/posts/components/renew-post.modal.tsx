// @/features/posts/components/renew-post.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { useGetAccount } from '@/features/auth/api/auth.queries';
import { useGetVips } from '@/features/vips/api/vips.queries';
import { useAuthStore } from '@/stores/auth.store';
import { formatCurrency } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { App, Button, Divider, Form, InputNumber, Skeleton, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRenewPost } from '../api/posts.mutations';
import { POSTS_QUERY_KEYS } from '../api/posts.queries';
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
    const queryClient = useQueryClient();

    // Zustand Store
    const setUser = useAuthStore((state) => state.setUser);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // --- API QUERIES ---
    // Lấy thông tin tài khoản mới nhất để check số dư
    const { data: userData, isLoading: isLoadingUser, refetch: refetchAccount } = useGetAccount(isOpen && isAuthenticated);

    // Lấy danh sách VIP để tính toán giá tiền
    const { data: vipsData, isLoading: isLoadingVips } = useGetVips();

    // --- MUTATION ---
    const renewPostMutation = useRenewPost();

    // --- FORM SETUP ---
    const { control, handleSubmit, watch, reset } = useForm<RenewPostFormValues>({
        resolver: zodResolver(renewPostSchema),
        defaultValues: {
            id: 0,
            numberOfDays: 7,
        },
    });

    const watchDays = watch('numberOfDays') || 0;

    // Reset form mỗi khi mở modal với post mới
    useEffect(() => {
        if (isOpen && post) {
            reset({
                id: post.id,
                numberOfDays: 7,
            });
        }
    }, [isOpen, post, reset]);

    // --- LOGIC TÍNH TOÁN ---
    const currentVip = useMemo(() => {
        return vipsData?.find((v) => v.id === post?.vip?.id);
    }, [vipsData, post]);

    const currentVipPrice = currentVip?.pricePerDay || 0;
    const totalCost = currentVipPrice * watchDays;
    const userBalance = userData?.balance || 0;
    const isInsufficientBalance = userBalance < totalCost;

    // --- HÀNH ĐỘNG GỬI DỮ LIỆU ---
    const onSubmit = async (values: RenewPostFormValues) => {
        if (isInsufficientBalance) {
            message.error('Số dư tài khoản không đủ để thực hiện gia hạn!');
            return;
        }

        try {
            // 1. Gọi API gia hạn
            await renewPostMutation.mutateAsync(values);

            // 2. Cập nhật lại thông tin User trong Store (Số dư mới)
            const { data: freshUser } = await refetchAccount();
            if (freshUser) {
                setUser(freshUser);
            }

            // 3. Làm mới danh sách bài đăng để cập nhật ngày hết hạn trên UI
            queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.all });

            message.success('Gia hạn tin đăng thành công!');
            onClose();
        } catch (error) {
            console.error('Lỗi khi gia hạn:', error);
            // Thông báo lỗi cụ thể từ server nếu có đã được xử lý ở mutation hoặc catch tại đây
        }
    };

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            title="Gia hạn tin đăng"
            width={480}
            isLoading={renewPostMutation.isPending}
        >
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="mt-2 flex flex-col gap-3">
                {/* Section: Thông tin tin đăng hiện tại */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tin đang chọn</Text>
                    <Title level={5} className="!m-0 !mt-1 !text-[15px] line-clamp-2">
                        {post?.title}
                    </Title>
                    {post?.expireDate && (
                        <div className="mt-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            <Text className="text-xs text-red-500 font-medium">
                                Hết hạn lúc: {new Date(post.expireDate).toLocaleString('vi-VN')}
                            </Text>
                        </div>
                    )}
                </div>

                {/* Section: Cấu hình gia hạn */}
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item label={<span className="font-semibold text-gray-700">Số ngày muốn thêm</span>} required>
                        <Controller
                            name="numberOfDays"
                            control={control}
                            render={({ field, fieldState }) => (
                                <InputNumber
                                    {...field}
                                    min={1}
                                    max={365}
                                    className="w-full"
                                    size="large"
                                    placeholder="VD: 7, 30..."
                                    status={fieldState.error ? 'error' : ''}
                                />
                            )}
                        />
                    </Form.Item>

                    <Form.Item label={<span className="font-semibold text-gray-700">Gói tin hiện tại</span>}>
                        <div className="flex items-center px-3 h-10 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed">
                            <Text strong className="text-sm text-gray-600 truncate">
                                {post?.vip?.name}
                            </Text>
                        </div>
                    </Form.Item>
                </div>

                {/* Section: Tổng kết tài chính */}
                <div className="flex flex-col gap-3 p-4 rounded-xl bg-orange-50/50 border border-orange-100 mt-2">
                    <div className="flex justify-between items-center">
                        <Text className="text-gray-600">Số dư khả dụng:</Text>
                        {isLoadingUser ? (
                            <Skeleton.Button active size="small" className="!w-24 !h-6" />
                        ) : (
                            <Text strong className="text-gray-800">{formatCurrency(userBalance)}</Text>
                        )}
                    </div>

                    <Divider className="!m-0 !border-orange-100" />

                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <Text className="font-bold text-orange-800 uppercase text-[11px] tracking-wider">Tổng phí thanh toán</Text>
                            <Text className="text-[10px] text-orange-600/80 italic">
                                ({watchDays} ngày × {formatCurrency(currentVipPrice)}/ngày)
                            </Text>
                        </div>
                        {isLoadingVips ? (
                            <Skeleton.Button active size="small" className="!w-24 !h-8" />
                        ) : (
                            <Text className="font-black text-2xl text-orange-600">{formatCurrency(totalCost)}</Text>
                        )}
                    </div>

                    {/* Cảnh báo thiếu tiền */}
                    {!isLoadingUser && isInsufficientBalance && watchDays > 0 && (
                        <div className="bg-white/80 p-2 rounded-lg border border-red-100">
                            <Text type="danger" className="text-[11px] block text-center leading-4">
                                ⚠️ Tài khoản không đủ tiền. Bạn cần nạp thêm <b>{formatCurrency(totalCost - userBalance)}</b> để thực hiện.
                            </Text>
                        </div>
                    )}
                </div>

                {/* Nút hành động */}
                <div className="flex justify-end gap-3 mt-4">
                    <Button
                        onClick={onClose}
                        size="large"
                        className="px-6 rounded-lg font-medium"
                        disabled={renewPostMutation.isPending}
                    >
                        Để sau
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={renewPostMutation.isPending}
                        disabled={!watchDays || watchDays < 1 || isLoadingVips || isInsufficientBalance}
                        className="px-8 rounded-lg font-bold shadow-md shadow-blue-100"
                    >
                        Thanh toán & Gia hạn ngay
                    </Button>
                </div>
            </Form>
        </AppModal>
    );
}