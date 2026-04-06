// @/features/posts/posts.schema.ts

import { z } from 'zod';

export const listingDetailSchema = z.object({
    bedrooms: z.coerce.number().min(1, 'Số phòng ngủ phải từ 1 trở lên').max(100).optional(),
    bathrooms: z.coerce.number().min(1, 'Số phòng tắm phải từ 1 trở lên').max(100).optional(),
    houseDirection: z.enum(['NORTH', 'NORTHEAST', 'EAST', 'SOUTHEAST', 'SOUTH', 'SOUTHWEST', 'WEST', 'NORTHWEST']).optional(),
    balconyDirection: z.enum(['NORTH', 'NORTHEAST', 'EAST', 'SOUTHEAST', 'SOUTH', 'SOUTHWEST', 'WEST', 'NORTHWEST']).optional(),
    legalStatus: z.enum(['PINK_BOOK', 'SALE_CONTRACT', 'WAITING', 'OTHER']).optional(),
    furnishing: z.enum(['FULLY_FURNISHED', 'BASIC', 'UNFURNISHED', 'OTHER']).optional(),
});

export const createPostSchema = z.object({
    title: z.string({ message: 'Tiêu đề không được để trống' })
        .min(1, 'Tiêu đề không được để trống')
        .max(255, 'Tiêu đề không được quá 255 ký tự'),
    description: z.string({ message: 'Mô tả không được để trống' })
        .min(1, 'Mô tả không được để trống'),
    type: z.enum(['SALE', 'RENT', 'PROJECT'], { message: 'Loại tin đăng không hợp lệ' }),
    price: z.coerce.number({ message: 'Giá phải là số' }).min(0, 'Giá phải lớn hoặc bằng 0'),
    area: z.coerce.number({ message: 'Diện tích phải là số' }).min(0.1, 'Diện tích phải lớn hơn 0'),
    categoryId: z.coerce.number({ message: 'Danh mục không được để trống' }),
    provinceCode: z.coerce.number({ message: 'Tỉnh/Thành phố không được để trống' }),
    districtCode: z.coerce.number({ message: 'Quận/Huyện không được để trống' }),
    wardCode: z.coerce.number().optional(),
    streetAddress: z.string({ message: 'Địa chỉ không được để trống' }),
    vipId: z.coerce.number().optional(),
    imageUrls: z.array(z.string()).min(1, 'Phải có ít nhất 1 ảnh'),
    listingDetail: listingDetailSchema.optional(),
    numberOfDays: z.coerce.number({ message: 'Số ngày đăng không hợp lệ' }).min(1, 'Số ngày đăng tối thiểu là 1'),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;

export const updatePostStatusSchema = z.object({
    postId: z.number({ message: 'ID bài đăng không hợp lệ' }),
    status: z.enum(['PENDING', 'REVIEW_LATER', 'APPROVED', 'REJECTED', 'EXPIRED'], { message: 'Trạng thái không hợp lệ' }),
    message: z.string().optional(),
    sendNotification: z.boolean().default(true),
});

export type UpdatePostStatusFormValues = z.infer<typeof updatePostStatusSchema>;