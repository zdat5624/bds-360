// @/features/users/users.schema.ts

import { z } from 'zod';

const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;

export const createUserSchema = z.object({
    name: z.string()
        .min(5, 'Username phải có độ dài từ 5 đến 50 ký tự')
        .max(50, 'Username phải có độ dài từ 5 đến 50 ký tự'),
    email: z.string()
        .email('Email không hợp lệ')
        .min(1, 'Email không được để trống'),
    password: z.string()
        .min(6, 'Password phải có ít nhất 6 ký tự'),
    phone: z.string()
        .regex(phoneRegex, 'Số điện thoại không hợp lệ'),
    role: z.enum(['ADMIN', 'USER'], {
        message: 'Role không được để trống hoặc không hợp lệ'
    }),
    gender: z.enum(['FEMALE', 'MALE', 'OTHER'], {
        message: 'Gender không được để trống hoặc không hợp lệ'
    }),
    address: z.string().optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
    id: z.number(),
    name: z.string()
        .min(5, 'Username phải có độ dài từ 5 đến 50 ký tự')
        .max(50, 'Username phải có độ dài từ 5 đến 50 ký tự'),
    role: z.enum(['ADMIN', 'USER'], {
        message: 'Role không được để trống hoặc không hợp lệ'
    }),
    gender: z.enum(['FEMALE', 'MALE', 'OTHER'], {
        message: 'Gender không được để trống hoặc không hợp lệ'
    }),
    avatar: z.string().optional(),
    phone: z.string()
        .regex(phoneRegex, 'Số điện thoại không hợp lệ'),
    address: z.string().optional(),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export const updateProfileSchema = z.object({
    id: z.number(),
    name: z.string()
        .min(5, 'Tên phải có độ dài từ 5 đến 50 ký tự')
        .max(50, 'Tên phải có độ dài từ 5 đến 50 ký tự'),
    gender: z.enum(['FEMALE', 'MALE', 'OTHER'], {
        message: 'Gender không được để trống hoặc không hợp lệ'
    }),
    avatar: z.string().optional(),
    phone: z.string()
        .regex(phoneRegex, 'Số điện thoại không hợp lệ'),
    address: z.string().optional(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;