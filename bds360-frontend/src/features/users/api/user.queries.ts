// @/features/users/api/users.queries.ts

import customFetch from '@/lib/custom-fetch';
import { PageResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { UserFilterRequest, UserResponse } from './types';

export const USERS_QUERY_KEYS = {
    all: ['users'] as const,
    lists: () => [...USERS_QUERY_KEYS.all, 'list'] as const,
    list: (filters: UserFilterRequest) => [...USERS_QUERY_KEYS.lists(), filters] as const,
    details: () => [...USERS_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: number) => [...USERS_QUERY_KEYS.details(), id] as const,
};

const getUsers = async (filters: UserFilterRequest): Promise<PageResponse<UserResponse>> => {
    return customFetch.get('/admin/users', { params: filters });
};

const getUserById = async (id: number): Promise<UserResponse> => {
    return customFetch.get(`/users/${id}`);
};

export const useGetUsers = (filters: UserFilterRequest) => {
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