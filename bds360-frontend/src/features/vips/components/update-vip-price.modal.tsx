// @/features/vips/components/update-vip-price.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { getErrorMessage } from '@/utils/error.util';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Form, InputNumber } from 'antd';
import { useEffect } from 'react';
import { Controller, Resolver, SubmitHandler, useForm } from 'react-hook-form';
import { UpdateVipPricePayload, Vip } from '../api/types';
import { useUpdateVipPrice } from '../api/vips.mutations';
import { updateVipPriceSchema } from '../vips.schema';

interface UpdateVipPriceModalProps {
    isOpen: boolean;
    onClose: () => void;
    vip: Vip | null;
}

export function UpdateVipPriceModal({ isOpen, onClose, vip }: UpdateVipPriceModalProps) {
    const { message } = App.useApp();
    const { mutateAsync: updatePrice, isPending } = useUpdateVipPrice();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UpdateVipPricePayload>({
        resolver: zodResolver(updateVipPriceSchema) as Resolver<UpdateVipPricePayload>,
        defaultValues: {
            id: 0,
            newPrice: 0
        }
    });

    useEffect(() => {
        if (isOpen && vip) {
            reset({
                id: vip.id,
                newPrice: vip.pricePerDay
            });
        }
    }, [isOpen, vip, reset]);

    const onSubmit: SubmitHandler<UpdateVipPricePayload> = async (values) => {
        try {
            await updatePrice(values);
            message.success(`Đã cập nhật giá cho ${vip?.name} thành công`);
            onClose();
        } catch (error: unknown) {
            message.error(getErrorMessage(error));
        }
    };

    return (
        <AppModal
            title={`Cập nhật đơn giá: ${vip?.name}`}
            isOpen={isOpen}
            onClose={onClose}
            width={400}
            isLoading={isPending}
        >
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Form.Item
                    label="Đơn giá mới (VNĐ/Ngày)"
                    validateStatus={errors.newPrice ? 'error' : ''}
                    help={errors.newPrice?.message}
                >
                    <Controller
                        name="newPrice"
                        control={control}
                        render={({ field }) => (
                            <InputNumber<number>
                                {...field}
                                className="!w-full"
                                size="large"
                                min={0}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => {
                                    const val = value ? value.replace(/\$\s?|(,*)/g, '') : '';
                                    return Number(val) || 0;
                                }}
                                placeholder="Nhập số tiền..."
                            />
                        )}
                    />
                </Form.Item>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                        disabled={isPending}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </Form>
        </AppModal>
    );
}