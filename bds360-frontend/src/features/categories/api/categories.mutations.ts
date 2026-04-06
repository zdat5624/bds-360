// @/features/categories/api/categories.mutations.ts

import customFetch from '@/lib/custom-fetch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CATEGORIES_QUERY_KEYS } from './categories.queries';
import { Category, CategoryCreatePayload, CategoryUpdatePayload } from './types';

const createCategory = async (payload: CategoryCreatePayload): Promise<Category> => {
    return customFetch.post('/admin/categories', payload);
};

const updateCategory = async (payload: CategoryUpdatePayload): Promise<Category> => {
    return customFetch.put('/admin/categories', payload);
};

const deleteCategory = async (id: number): Promise<void> => {
    return customFetch.delete(`/admin/categories/${id}`);
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            // Làm mới lại mọi danh sách (cả public và admin)
            queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.lists() });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCategory,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.detail(variables.id) });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.lists() });
        },
    });
};