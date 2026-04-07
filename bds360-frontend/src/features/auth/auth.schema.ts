// @/features/auth/auth.schema.ts

import { GENDER_VALUES } from '@/constants';
import { z } from 'zod';

const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;

export const loginSchema = z.object({
    username: z.email({ error: 'Vui lòng nhập đúng định dạng email' })
        .trim()
        .min(1, { error: 'Tên đăng nhập không được để trống' }),

    password: z.string({ error: 'Mật khẩu không được để trống' })
        .trim()
        .min(1, { error: 'Mật khẩu không được để trống' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    name: z.string({ error: 'Tên người dùng không được để trống' })
        .trim()
        .min(5, { error: 'Tên người dùng phải có độ dài từ 5 đến 50 ký tự' })
        .max(50, { error: 'Tên người dùng phải có độ dài từ 5 đến 50 ký tự' }),

    email: z.email({ error: 'Email không hợp lệ' })
        .trim()
        .min(1, { error: 'Email không được để trống' }),

    password: z.string({ error: 'Mật khẩu không được để trống' })
        .trim()
        .min(6, { error: 'Mật khẩu phải có ít nhất 6 ký tự' }),

    phone: z.string({ error: 'Số điện thoại không được để trống' })
        .trim()
        .min(1, { error: 'Số điện thoại không được để trống' })
        .regex(phoneRegex, { error: 'Số điện thoại không hợp lệ' }),

    gender: z.enum(GENDER_VALUES, {
        error: 'Giới tính không được để trống hoặc không hợp lệ',
    }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
    email: z.email({ error: 'Email không hợp lệ' })
        .trim()
        .min(1, { error: 'Email không được để trống' }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
    email: z.email({ error: 'Email không hợp lệ' })
        .trim()
        .min(1, { error: 'Email không được để trống' }),

    code: z.string({ error: 'Mã xác nhận không được để trống' })
        .trim()
        .min(1, { error: 'Mã xác nhận không được để trống' }),

    newPassword: z.string({ error: 'Mật khẩu mới không được để trống' })
        .trim()
        .min(6, { error: 'Mật khẩu mới phải có ít nhất 6 ký tự' }),
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z.object({
    currentPassword: z.string({ error: 'Mật khẩu hiện tại không được để trống' })
        .trim()
        .min(1, { error: 'Mật khẩu hiện tại không được để trống' }),

    newPassword: z.string({ error: 'Mật khẩu mới không được để trống' })
        .trim()
        .min(6, { error: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
        .max(100, { error: 'Mật khẩu mới không được vượt quá 100 ký tự' }),
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;