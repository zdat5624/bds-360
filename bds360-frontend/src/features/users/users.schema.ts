// @/features/users/users.schema.ts

import { GENDER_VALUES, USER_ROLE_VALUES } from '@/constants';
import { z } from 'zod';

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