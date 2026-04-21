// @/features/posts/api/posts.queries.ts

import customFetch from '@/lib/custom-fetch';
import { BaseFilterParams, PageResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Post, PostFilterParams, PostViewChartResponse, SavedPostResponse } from './types';

export const POSTS_QUERY_KEYS = {
    all: ['posts'] as const,
    lists: () => [...POSTS_QUERY_KEYS.all, 'list'] as const,
    //  Scope 'admin' giờ dùng chung cho cả role MODERATOR trong logic code
    list: (scope: 'public' | 'admin' | 'my' | 'saved', filters: PostFilterParams | BaseFilterParams) =>
        [...POSTS_QUERY_KEYS.lists(), scope, filters] as const,
    details: () => [...POSTS_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: number) => [...POSTS_QUERY_KEYS.details(), id] as const,
    analytics: (id: number) => [...POSTS_QUERY_KEYS.detail(id), 'analytics'] as const,
    dailyViews: (id: number, days: number) => [...POSTS_QUERY_KEYS.analytics(id), 'daily', days] as const,
    monthlyViews: (id: number, months: number) => [...POSTS_QUERY_KEYS.analytics(id), 'monthly', months] as const,
};

const getPosts = async (scope: 'public' | 'admin' | 'my', filters: PostFilterParams): Promise<PageResponse<Post>> => {
    let endpoint = '/posts';
    //  Sửa đổi: Đổi đường dẫn API từ /admin thành /manage
    if (scope === 'admin') endpoint = '/manage/posts';
    if (scope === 'my') endpoint = '/posts/my-posts';

    return customFetch.get(endpoint, { params: filters });
};

const getPostById = async (id: number): Promise<Post> => {
    return customFetch.get(`/posts/${id}`);
};

const getSavedPosts = async (filters: BaseFilterParams): Promise<PageResponse<SavedPostResponse>> => {
    return customFetch.get('/posts/saved', { params: filters });
};

const getPostViewsDaily = async (id: number, days: number = 7): Promise<PostViewChartResponse[]> => {
    return customFetch.get(`/posts/${id}/analytics/views`, { params: { days } });
};

const getPostViewsMonthly = async (id: number, months: number = 6): Promise<PostViewChartResponse[]> => {
    return customFetch.get(`/posts/${id}/analytics/views/monthly`, { params: { months } });
};

// --- HOOKS ---

export const useGetPosts = (scope: 'public' | 'admin' | 'my', filters: PostFilterParams) => {
    return useQuery({
        queryKey: POSTS_QUERY_KEYS.list(scope, filters),
        queryFn: () => getPosts(scope, filters),
    });
};

export const useGetPostById = (id: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: POSTS_QUERY_KEYS.detail(id),
        queryFn: () => getPostById(id),
        enabled,
    });
};

export const useGetSavedPosts = (filters: BaseFilterParams) => {
    return useQuery({
        queryKey: POSTS_QUERY_KEYS.list('saved', filters),
        queryFn: () => getSavedPosts(filters),
    });
};

export const useGetPostViewsDaily = (id: number, days: number = 7, enabled: boolean = true) => {
    return useQuery({
        queryKey: POSTS_QUERY_KEYS.dailyViews(id, days),
        queryFn: () => getPostViewsDaily(id, days),
        enabled: enabled && !!id,
    });
};

export const useGetPostViewsMonthly = (id: number, months: number = 6, enabled: boolean = true) => {
    return useQuery({
        queryKey: POSTS_QUERY_KEYS.monthlyViews(id, months),
        queryFn: () => getPostViewsMonthly(id, months),
        enabled: enabled && !!id,
    });
};