// @/features/posts/posts.schema.ts

import { LISTING_TYPE_VALUES } from '@/constants';
import { z } from 'zod';
import {
    COMPASS_DIRECTION_VALUES,
    FURNISHING_VALUES,
    LEGAL_STATUS_VALUES,
    POST_STATUS_VALUES,
} from './posts.constant';

export const listingDetailSchema = z.object({
    bedrooms: z.coerce.number()
        .min(1, { message: 'Số phòng ngủ phải từ 1 trở lên' })
        .max(100, { message: 'Số phòng ngủ không hợp lệ' })
        .optional(),
    bathrooms: z.coerce.number()
        .min(1, { message: 'Số phòng tắm phải từ 1 trở lên' })
        .max(100, { message: 'Số phòng tắm không hợp lệ' })
        .optional(),
    houseDirection: z.enum(COMPASS_DIRECTION_VALUES, { message: 'Hướng nhà không hợp lệ' }).optional(),
    balconyDirection: z.enum(COMPASS_DIRECTION_VALUES, { message: 'Hướng ban công không hợp lệ' }).optional(),
    legalStatus: z.enum(LEGAL_STATUS_VALUES, { message: 'Trạng thái pháp lý không hợp lệ' }).optional(),
    furnishing: z.enum(FURNISHING_VALUES, { message: 'Tình trạng nội thất không hợp lệ' }).optional(),
});

export const createPostSchema = z.object({
    title: z.string({ message: 'Tiêu đề không được để trống' })
        .trim()
        .min(1, { message: 'Tiêu đề không được để trống' })
        .max(255, { message: 'Tiêu đề không được quá 255 ký tự' }),

    description: z.string({ message: 'Mô tả không được để trống' })
        .trim()
        .min(1, { message: 'Mô tả không được để trống' }),

    type: z.enum(LISTING_TYPE_VALUES, {
        message: 'Loại tin đăng không được để trống hoặc không hợp lệ'
    }),

    price: z.coerce.number({ message: 'Giá phải là số' })
        .min(0, { message: 'Giá phải lớn hoặc bằng 0' }),

    area: z.coerce.number({ message: 'Diện tích phải là số' })
        .min(0.1, { message: 'Diện tích phải lớn hơn 0' }),

    categoryId: z.coerce.number({ message: 'Danh mục không được để trống' }),
    provinceCode: z.coerce.number({ message: 'Tỉnh/Thành phố không được để trống' }),
    districtCode: z.coerce.number({ message: 'Quận/Huyện không được để trống' }),
    wardCode: z.coerce.number().optional(),

    streetAddress: z.string({ message: 'Địa chỉ không được để trống' })
        .trim()
        .min(1, { message: 'Địa chỉ không được để trống' }),

    vipId: z.coerce.number().optional(),

    imageUrls: z.array(z.string(), { message: 'Danh sách ảnh không hợp lệ' })
        .min(1, { message: 'Phải có ít nhất 1 ảnh' }),

    listingDetail: listingDetailSchema.optional(),

    numberOfDays: z.coerce.number({ message: 'Số ngày đăng không hợp lệ' })
        .min(1, { message: 'Số ngày đăng tối thiểu là 1' }),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;

export const updatePostStatusSchema = z.object({
    postId: z.number({ message: 'ID bài đăng không hợp lệ' }),

    status: z.enum(POST_STATUS_VALUES, {
        message: 'Trạng thái không hợp lệ'
    }),

    message: z.string().trim().optional(), // Thêm trim() đề phòng khoảng trắng vô nghĩa
    sendNotification: z.boolean().default(true),
});

export type UpdatePostStatusFormValues = z.infer<typeof updatePostStatusSchema>;