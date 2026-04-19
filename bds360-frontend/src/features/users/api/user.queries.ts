// @/features/users/api/users.queries.ts

import customFetch from '@/lib/custom-fetch';
import { BaseFilterParams, PageResponse, User } from '@/types';
import { useQuery } from '@tanstack/react-query';
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

    // 🌟 ĐÃ ĐƯA VỀ ĐÚNG CHỖ NÀY:
    history: (filters: BaseFilterParams) => [...VERIFICATIONS_QUERY_KEYS.all, 'my-history', filters] as const,
};

const getVerificationRequests = async (filters: VerificationFilterParams): Promise<PageResponse<VerificationSubmission>> => {
    return customFetch.get('/manage/verification-requests', { params: filters });
};

export const useGetVerificationRequests = (filters: VerificationFilterParams) => {
    return useQuery({
        queryKey: VERIFICATIONS_QUERY_KEYS.list(filters),
        queryFn: () => getVerificationRequests(filters),
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

// Thêm Fetcher
const getLatestVerification = async (userId: number): Promise<VerificationSubmission> => {
    return customFetch.get(`/manage/verification-requests/users/${userId}/latest`);
};

// Thêm Hook
export const useGetLatestVerification = (userId: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: [...VERIFICATIONS_QUERY_KEYS.all, 'latest', userId] as const,
        queryFn: () => getLatestVerification(userId),
        enabled: enabled && !!userId,
    });
};