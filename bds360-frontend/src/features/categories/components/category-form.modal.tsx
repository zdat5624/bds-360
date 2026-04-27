'use client';

import { AppModal } from '@/components/base/app.modal';
import { LISTING_TYPE_OPTIONS } from '@/constants';
import { getErrorMessage } from '@/utils/error.util';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useCreateCategory, useUpdateCategory } from '../api/categories.mutations';
import { Category } from '../api/types';
import { CreateCategoryFormValues, createCategorySchema } from '../categories.schema';

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null; // null là Thêm mới, có giá trị là Chỉnh sửa
}

export function CategoryFormModal({ isOpen, onClose, category }: CategoryFormModalProps) {
    const { message } = App.useApp();
    const isEdit = !!category;

    const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory();
    const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory();
    const isLoading = isCreating || isUpdating;

    const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateCategoryFormValues>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: { name: '', type: 'SALE' }
    });

    useEffect(() => {
        if (isOpen) {
            reset(category ? { name: category.name, type: category.type } : { name: '', type: 'SALE' });
        }
    }, [isOpen, category, reset]);

    const onSubmit: SubmitHandler<CreateCategoryFormValues> = async (data) => {
        try {
            if (isEdit && category) {
                await updateCategory({ id: category.id, ...data });
                message.success('Cập nhật danh mục thành công');
            } else {
                await createCategory(data);
                message.success('Thêm danh mục mới thành công');
            }
            onClose();
        } catch (error) {
            message.error(getErrorMessage(error));

        }
    };

    return (
        <AppModal
            title={isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            isOpen={isOpen}
            onClose={onClose}
            width={450}
            isLoading={isLoading}
        >
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Form.Item label="Tên danh mục" validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Ví dụ: Bán căn hộ chung cư" size="large" autoFocus />}
                    />
                </Form.Item>

                <Form.Item label="Loại hình" validateStatus={errors.type ? 'error' : ''} help={errors.type?.message}>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Select {...field} options={LISTING_TYPE_OPTIONS} size="large" className="!w-full" />
                        )}
                    />
                </Form.Item>

                <div className="flex justify-end gap-2 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors" disabled={isLoading}>Hủy</button>
                    <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50">
                        {isLoading ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Tạo danh mục'}
                    </button>
                </div>
            </Form>
        </AppModal>
    );
}