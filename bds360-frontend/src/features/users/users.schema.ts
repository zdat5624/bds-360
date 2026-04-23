// @/features/users/users.schema.ts

import { GENDER_VALUES, USER_ROLE_VALUES } from '@/constants';
import { z } from 'zod';
import { VERIFICATION_STATUS_VALUES } from './users.constant';

const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;

export const createUserSchema = z.object({
    name: z.string({ message: 'Tên người dùng không được để trống' })
        .trim()
        .min(5, { message: 'Tên người dùng phải có độ dài từ 5 đến 50 ký tự' })
        .max(50, { message: 'Tên người dùng phải có độ dài từ 5 đến 50 ký tự' }),

    email: z.string({ message: 'Email không được để trống' })
        .trim()
        .min(1, { message: 'Email không được để trống' })
        .pipe(z.email({ message: 'Email không hợp lệ' })),

    password: z.string({ message: 'Mật khẩu không được để trống' })
        .trim()
        .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),

    phone: z.string({ message: 'Số điện thoại không được để trống' })
        .trim()
        .regex(phoneRegex, { message: 'Số điện thoại không hợp lệ' }),

    role: z.enum(USER_ROLE_VALUES, {
        message: 'Vai trò không được để trống hoặc không hợp lệ'
    }),

    gender: z.enum(GENDER_VALUES, {
        message: 'Giới tính không được để trống hoặc không hợp lệ'
    }),

    address: z.string().trim().optional(),

    avatar: z.string({ message: 'Vui lòng chọn ảnh đại diện' })
        .trim()
        .min(1, { message: 'Vui lòng chọn ảnh đại diện' }),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
    id: z.number({ message: 'ID không hợp lệ' }),

    name: z.string({ message: 'Tên người dùng không được để trống' })
        .trim()
        .min(5, { message: 'Tên người dùng phải có độ dài từ 5 đến 50 ký tự' })
        .max(50, { message: 'Tên người dùng phải có độ dài từ 5 đến 50 ký tự' }),

    role: z.enum(USER_ROLE_VALUES, {
        message: 'Vai trò không được để trống hoặc không hợp lệ'
    }),

    gender: z.enum(GENDER_VALUES, {
        message: 'Giới tính không được để trống hoặc không hợp lệ'
    }),

    avatar: z.string().trim().optional(),

    phone: z.string({ message: 'Số điện thoại không được để trống' })
        .trim()
        .regex(phoneRegex, { message: 'Số điện thoại không hợp lệ' }),

    address: z.string().trim().optional(),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export const updateProfileSchema = z.object({
    id: z.number({ message: 'ID không hợp lệ' }),

    name: z.string({ message: 'Tên người dùng không được để trống' })
        .trim()
        .min(5, { message: 'Tên người dùng phải có độ dài từ 5 đến 50 ký tự' })
        .max(50, { message: 'Tên người dùng phải có độ dài từ 5 đến 50 ký tự' }),

    gender: z.enum(GENDER_VALUES, {
        message: 'Giới tính không được để trống hoặc không hợp lệ'
    }),

    avatar: z.string().trim().optional(),

    phone: z.string({ message: 'Số điện thoại không được để trống' })
        .trim()
        .regex(phoneRegex, { message: 'Số điện thoại không hợp lệ' }),

    address: z.string().trim().optional(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;



export const submitVerificationSchema = z.object({
    idCardFront: z.string({ message: 'Vui lòng tải lên mặt trước' })
        .min(1, { message: 'Vui lòng cung cấp ảnh mặt trước CCCD/CMND' }),
    idCardBack: z.string({ message: 'Vui lòng tải lên mặt sau' })
        .min(1, { message: 'Vui lòng cung cấp ảnh mặt sau CCCD/CMND' }),
});

export type SubmitVerificationFormValues = z.infer<typeof submitVerificationSchema>;


export const reviewVerificationSchema = z.object({
    requestId: z.number(),
    status: z.enum(VERIFICATION_STATUS_VALUES, { message: 'Trạng thái không hợp lệ' }),
    note: z.string().trim().optional(),
}).superRefine((data, ctx) => {
    // Logic bắt buộc nhập lý do nếu từ chối
    if (data.status === 'REJECTED' && (!data.note || data.note.length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Vui lòng nhập lý do từ chối',
            path: ['note'], // Focus lỗi vào ô input note
        });
    }
});

export type ReviewVerificationFormValues = z.infer<typeof reviewVerificationSchema>;