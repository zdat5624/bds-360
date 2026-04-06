// @/features/categories/categories.schema.ts

import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string({ message: 'Tên danh mục không được để trống' })
        .min(5, 'Tên danh mục phải từ 5 đến 100 ký tự')
        .max(100, 'Tên danh mục phải từ 5 đến 100 ký tự'),
    type: z.enum(['SALE', 'RENT', 'PROJECT'], {
        message: 'Loại danh mục không được để trống hoặc không hợp lệ'
    }),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
    id: z.number({ message: 'ID không hợp lệ' }),
    name: z.string({ message: 'Tên danh mục không được để trống' })
        .min(5, 'Tên danh mục phải từ 5 đến 100 ký tự')
        .max(100, 'Tên danh mục phải từ 5 đến 100 ký tự'),
    type: z.enum(['SALE', 'RENT', 'PROJECT'], {
        message: 'Loại danh mục không được để trống hoặc không hợp lệ'
    }),
});

export type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>;