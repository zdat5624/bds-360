// @/features/users/api/users.queries.ts

import customFetch from '@/lib/custom-fetch';
import { PageResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { User, UserFilterParams } from './types';

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