// @/features/categories/categories.schema.ts

import { LISTING_TYPE_VALUES } from '@/constants';
import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string({ message: 'Tên danh mục không được để trống' })
        .trim()
        .min(5, { message: 'Tên danh mục phải từ 5 đến 50 ký tự' })
        .max(50, { message: 'Tên danh mục phải từ 5 đến 50 ký tự' }),

    type: z.enum(LISTING_TYPE_VALUES, {
        message: 'Loại danh mục không được để trống hoặc không hợp lệ'
    }),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
    id: z.number({ message: 'ID không hợp lệ' }),

    name: z.string({ message: 'Tên danh mục không được để trống' })
        .trim()
        .min(5, { message: 'Tên danh mục phải từ 5 đến 50 ký tự' })
        .max(50, { message: 'Tên danh mục phải từ 5 đến 50 ký tự' }),

    type: z.enum(LISTING_TYPE_VALUES, {
        message: 'Loại danh mục không được để trống hoặc không hợp lệ'
    }),
});

export type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>;