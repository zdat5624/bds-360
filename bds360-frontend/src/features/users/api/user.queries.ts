// @/features/users/api/users.queries.ts

import customFetch from '@/lib/custom-fetch';
import { BaseFilterParams, PageResponse, User } from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { UserFilterParams, VerificationFilterParams, VerificationSubmission } from './types';

export const USERS_QUERY_KEYS = {
    all: ['users'] as const,
    lists: () => [...USERS_QUERY_KEYS.all, 'list'] as const,
    list: (filters: UserFilterParams) => [...USERS_QUERY_KEYS.lists(), filters] as const,
    details: () => [...USERS_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: number) => [...USERS_QUERY_KEYS.details(), id] as const,

};

const getUsers = async (filters: UserFilterParams): Promise<PageResponse<User>> => {
    return customFetch.get('/admin/users', { params: filters });
};

const getUserById = async (id: number): Promise<User> => {
    return customFetch.get(`/users/${id}`);
};

export const useGetUsers = (filters: UserFilterParams) => {
    return useQuery({
        queryKey: USERS_QUERY_KEYS.list(filters),
        queryFn: () => getUsers(filters),
    });
};

export const useGetUserById = (id: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: USERS_QUERY_KEYS.detail(id),
        queryFn: () => getUserById(id),
        enabled,
    });
};


// 2. NHÓM QUERIES CHO VERIFICATIONS
export const VERIFICATIONS_QUERY_KEYS = {
    all: ['verifications'] as const,
    lists: () => [...VERIFICATIONS_QUERY_KEYS.all, 'list'] as const,
    list: (filters: VerificationFilterParams) => [...VERIFICATIONS_QUERY_KEYS.lists(), filters] as const,

    //  ĐÃ ĐƯA VỀ ĐÚNG CHỖ NÀY:
    history: (filters: BaseFilterParams) => [...VERIFICATIONS_QUERY_KEYS.all, 'my-history', filters] as const,
};

const getVerificationRequests = async (filters: VerificationFilterParams): Promise<PageResponse<VerificationSubmission>> => {
    return customFetch.get('/manage/verification-requests', { params: filters });
};

export const useGetVerificationRequests = (filters: VerificationFilterParams) => {
    return useQuery({
        queryKey: VERIFICATIONS_QUERY_KEYS.list(filters),
        queryFn: () => getVerificationRequests(filters),
        placeholderData: keepPreviousData,
    });
};

const getMyVerificationHistory = async (filters: BaseFilterParams): Promise<PageResponse<VerificationSubmission>> => {
    return customFetch.get('/users/verification/history', { params: filters });
};

export const useGetMyVerificationHistory = (filters: BaseFilterParams) => {
    return useQuery({
        queryKey: VERIFICATIONS_QUERY_KEYS.history(filters),
        queryFn: () => getMyVerificationHistory(filters),
    });
};


// 1. Đổi URL thành API dành cho User (không cần truyền userId lên URL nữa)
const getLatestVerification = async (userId: number): Promise<VerificationSubmission> => {
    return customFetch.get(`/manage/verification-requests/users/${userId}/latest`);
};

export const useGetLatestVerification = (userId: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: [...VERIFICATIONS_QUERY_KEYS.all, 'latest', userId] as const,
        // Cập nhật: Truyền userId vào function
        queryFn: () => getLatestVerification(userId),
        enabled: enabled && !!userId,

        // TỐI ƯU QUAN TRỌNG: Tắt tính năng tự động gọi lại (retry) khi lỗi.
        // Vì nếu người dùng chưa từng nộp đơn, API sẽ trả về 404 (Not Found).
        // React Query mặc định sẽ cố gọi lại 3 lần làm UI bị xoay (loading) rất lâu.
        retry: false,
    });
};

const getMyLatestVerification = async (): Promise<VerificationSubmission> => {
    return customFetch.get(`/users/verification/latest`);
};

export const useGetMyLatestVerification = (enabled: boolean = true) => {
    return useQuery({
        queryKey: [...VERIFICATIONS_QUERY_KEYS.all, 'my-latest'] as const,
        queryFn: () => getMyLatestVerification(),
        enabled,
        retry: false,
    });
};