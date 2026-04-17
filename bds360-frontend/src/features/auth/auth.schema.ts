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

    // Thêm field confirmPassword
    confirmPassword: z.string({ error: 'Vui lòng xác nhận lại mật khẩu' })
        .trim()
        .min(1, { error: 'Vui lòng xác nhận lại mật khẩu' }),

    phone: z.string({ error: 'Số điện thoại không được để trống' })
        .trim()
        .min(1, { error: 'Số điện thoại không được để trống' })
        .regex(phoneRegex, { error: 'Số điện thoại không hợp lệ' }),

    gender: z.enum(GENDER_VALUES, {
        error: 'Giới tính không được để trống hoặc không hợp lệ',
    }),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "Mật khẩu xác nhận không trùng khớp",
            path: ["confirmPassword"],
        });
    }
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

    confirmPassword: z.string({ error: 'Vui lòng xác nhận lại mật khẩu' })
        .trim()
        .min(1, { error: 'Vui lòng xác nhận lại mật khẩu' }),
}).superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Mật khẩu xác nhận không trùng khớp",
            path: ["confirmPassword"],
        });
    }
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z.object({
    currentPassword: z.string({ message: 'Vui lòng nhập mật khẩu hiện tại' })
        .min(1, { message: 'Vui lòng nhập mật khẩu hiện tại' }),

    newPassword: z.string({ message: 'Mật khẩu mới không được để trống' })
        .min(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
        .max(50, { message: 'Mật khẩu mới không được vượt quá 50 ký tự' }),

    confirmPassword: z.string({ message: 'Vui lòng xác nhận mật khẩu mới' })
        .min(1, { message: 'Vui lòng xác nhận mật khẩu mới' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;