// @/features/categories/api/categories.queries.ts

import customFetch from '@/lib/custom-fetch';
import { PageResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Category, CategoryFilterParams } from './types';

export const CATEGORIES_QUERY_KEYS = {
    all: ['categories'] as const,
    lists: () => [...CATEGORIES_QUERY_KEYS.all, 'list'] as const,
    list: (filters: CategoryFilterParams) => [...CATEGORIES_QUERY_KEYS.lists(), filters] as const,
    details: () => [...CATEGORIES_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: number) => [...CATEGORIES_QUERY_KEYS.details(), id] as const,
};

// Sử dụng chung cho cả Public và Admin theo thiết kế Controller
const getCategories = async (filters: CategoryFilterParams): Promise<PageResponse<Category>> => {
    return customFetch.get('/categories', { params: filters });
};

// Gọi riêng khi cần danh sách cho trang quản trị (Admin)
const getAdminCategories = async (filters: CategoryFilterParams): Promise<PageResponse<Category>> => {
    return customFetch.get('/admin/categories', { params: filters });
};

const getCategoryById = async (id: number): Promise<Category> => {
    return customFetch.get(`/categories/${id}`);
};

export const useGetCategories = (filters: CategoryFilterParams, isAdmin: boolean = false) => {
    return useQuery({
        // Đính kèm cờ isAdmin vào queryKey để cache không bị nhầm lẫn giữa 2 luồng
        queryKey: [...CATEGORIES_QUERY_KEYS.list(filters), { isAdmin }],
        queryFn: () => isAdmin ? getAdminCategories(filters) : getCategories(filters),
    });
};

export const useGetCategoryById = (id: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: CATEGORIES_QUERY_KEYS.detail(id),
        queryFn: () => getCategoryById(id),
        enabled,
    });
};