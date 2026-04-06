// @/features/posts/api/posts.queries.ts

import customFetch from '@/lib/custom-fetch';
import { PageResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Post, PostFilterRequest } from './types';

export const POSTS_QUERY_KEYS = {
    all: ['posts'] as const,
    lists: () => [...POSTS_QUERY_KEYS.all, 'list'] as const,
    list: (scope: 'public' | 'admin' | 'my', filters: PostFilterRequest) =>
        [...POSTS_QUERY_KEYS.lists(), scope, filters] as const,
    details: () => [...POSTS_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: number) => [...POSTS_QUERY_KEYS.details(), id] as const,
};

const getPosts = async (scope: 'public' | 'admin' | 'my', filters: PostFilterRequest): Promise<PageResponse<Post>> => {
    let endpoint = '/posts';
    if (scope === 'admin') endpoint = '/admin/posts';
    if (scope === 'my') endpoint = '/posts/my-posts';

    return customFetch.get(endpoint, { params: filters });
};

const getPostById = async (id: number): Promise<Post> => {
    return customFetch.get(`/posts/${id}`);
};

export const useGetPosts = (scope: 'public' | 'admin' | 'my', filters: PostFilterRequest) => {
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