// @/features/users/api/users.mutations.ts

import customFetch from '@/lib/custom-fetch';
import { User } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateUserPayload, UpdateProfilePayload, UpdateUserPayload } from './types';
import { USERS_QUERY_KEYS } from './user.queries';

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