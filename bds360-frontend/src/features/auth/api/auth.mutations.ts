// @/features/auth/api/auth.mutations.ts

import customFetch from '@/lib/custom-fetch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AUTH_QUERY_KEYS } from './auth.queries';
import {
    AuthResponse,
    ChangePasswordPayload,
    ForgotPasswordPayload,
    GoogleLoginPayload,
    LoginPayload,
    RegisterPayload,
    ResetPasswordPayload,
} from './types';

const login = async (payload: LoginPayload): Promise<AuthResponse> => {
    return customFetch.post('/auth/login', payload);
};

const googleLogin = async (payload: GoogleLoginPayload): Promise<AuthResponse> => {
    return customFetch.post('/auth/google', payload);
};


const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
    return customFetch.post('/auth/register', payload);
};

const forgotPassword = async (payload: ForgotPasswordPayload): Promise<void> => {
    return customFetch.post('/auth/forgot-password', payload);
};

const resetPassword = async (payload: ResetPasswordPayload): Promise<void> => {
    return customFetch.post('/auth/reset-password', payload);
};

const changePassword = async (payload: ChangePasswordPayload): Promise<void> => {
    return customFetch.post('/auth/change-password', payload);
};

export const useGoogleLoginMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: googleLogin,
        onSuccess: () => {
            // Sau khi login thành công, xóa cache để useGetAccount lấy data mới useGoogleLoginMutation
            queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.account() });
        },
    });
};

export const useLoginMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: () => {
            // Refresh lại thông tin account sau khi có token mới
            queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.account() });
        },
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: register,
    });
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword,
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword,
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: changePassword,
    });
};