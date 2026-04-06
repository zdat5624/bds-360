// @/features/auth/auth.schema.ts

import { z } from 'zod';

const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;

export const loginSchema = z.object({
    username: z.string().min(1, 'Username không được để trống'),
    password: z.string().min(1, 'Password không được để trống'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
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
    gender: z.enum(['FEMALE', 'MALE', 'OTHER'], {
        message: 'Gender không được để trống hoặc không hợp lệ',
    }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
    email: z.string()
        .email('Email không hợp lệ')
        .min(1, 'Email không được để trống'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    code: z.string().min(1, 'Mã xác nhận không được để trống'),
    newPassword: z.string()
        .min(6, 'Password phải có ít nhất 6 ký tự'),
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Mật khẩu hiện tại không được để trống'),
    newPassword: z.string()
        .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
        .max(100, 'Mật khẩu mới không được vượt quá 100 ký tự'),
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;