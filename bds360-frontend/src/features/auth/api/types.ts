// @/features/auth/api/types.ts

import { Gender } from '@/constants';
import { User } from '@/features/users';

export interface LoginPayload {
    username: string; // Trong Spring Boot đang dùng field name là username
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    user: User;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    phone: string;
    gender: Gender;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    email: string;
    code: string;
    newPassword: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}