// @/features/users/api/users.mutations.ts

import customFetch from '@/lib/custom-fetch';
import { User } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateUserPayload, ReviewVerificationPayload, SubmitVerificationPayload, UpdateProfilePayload, UpdateUserPayload } from './types';
import { USERS_QUERY_KEYS, VERIFICATIONS_QUERY_KEYS } from './user.queries';

const createUser = async (payload: CreateUserPayload): Promise<User> => {
    return customFetch.post('/admin/users', payload);
};

const updateUser = async (payload: UpdateUserPayload): Promise<User> => {
    return customFetch.put('/admin/users', payload);
};

const deleteUser = async (id: number): Promise<void> => {
    return customFetch.delete(`/admin/users/${id}`);
};

const updateProfile = async (payload: UpdateProfilePayload): Promise<User> => {
    return customFetch.put('/users/update-profile', payload);
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.lists() });
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUser,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.detail(variables.id) });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.lists() });
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.detail(variables.id) });
        },
    });
};


const submitVerification = async (payload: SubmitVerificationPayload): Promise<void> => {
    return customFetch.post('/users/verification/submit', payload);
};

const reviewVerification = async (payload: ReviewVerificationPayload): Promise<void> => {
    // Bóc requestId ra khỏi payload body để đưa lên URL
    const { requestId, ...rest } = payload;
    return customFetch.put(`/manage/verification-requests/${requestId}/review`, rest);
};

export const useSubmitVerification = (userId?: number) => { // Truyền thêm userId của người đang login
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitVerification,
        onSuccess: () => {
            // 1. Làm mới lịch sử nộp đơn của User
            queryClient.invalidateQueries({ queryKey: VERIFICATIONS_QUERY_KEYS.all });

            // 2. 🌟 Làm mới thông tin User để UI lập tức biết user đang ở trạng thái PENDING
            if (userId) {
                queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.detail(userId) });
            }
            // (Nếu bạn có một Query Key riêng cho getAccount / getProfile thì invalidate nó ở đây)
        },
    });
};

export const useReviewVerification = (userId?: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: reviewVerification,
        onSuccess: () => {
            // Làm mới danh sách đơn đang chờ duyệt
            queryClient.invalidateQueries({ queryKey: VERIFICATIONS_QUERY_KEYS.lists() });

            // Làm mới chi tiết user (nếu Admin đang thao tác trong Modal của User đó)
            if (userId) {
                queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.detail(userId) });
            }
        },
    });
};