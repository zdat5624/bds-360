// @/features/posts/api/posts.mutations.ts

import customFetch from '@/lib/custom-fetch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { POSTS_QUERY_KEYS } from './posts.queries';
import { Post, PostCreatePayload, PostUpdatePayload, UpdatePostStatusPayload } from './types';

const createPost = async (payload: PostCreatePayload): Promise<Post> => {
    return customFetch.post('/posts', payload);
};

const updatePost = async (payload: PostUpdatePayload): Promise<Post> => {
    return customFetch.put('/posts', payload);
};

const deletePost = async (id: number): Promise<void> => {
    return customFetch.delete(`/posts/${id}`);
};

// 🌟 Sửa đổi: Đổi /admin thành /manage cho đồng bộ với Backend mới
const deleteAdminPost = async (id: number): Promise<void> => {
    return customFetch.delete(`/manage/posts/${id}`);
};

// 🌟 Sửa đổi: Đổi /admin thành /manage cho đồng bộ với Backend mới
const updatePostStatus = async (payload: UpdatePostStatusPayload): Promise<Post> => {
    return customFetch.put('/manage/posts/status', payload);
};

const savePost = async (id: number): Promise<void> => {
    return customFetch.post(`/posts/${id}/save`);
};

const unsavePost = async (id: number): Promise<void> => {
    return customFetch.delete(`/posts/${id}/save`);
};

const incrementView = async (id: number): Promise<void> => {
    return customFetch.post(`/posts/${id}/view`);
};

// --- HOOKS ---

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.lists() });
        },
    });
};

export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePost,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.detail(variables.id) });
        },
    });
};

export const useDeletePost = (isAdmin: boolean = false) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => isAdmin ? deleteAdminPost(id) : deletePost(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.lists() });
        },
    });
};

export const useUpdatePostStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePostStatus,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.detail(variables.postId) });
        },
    });
};

export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: savePost,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [...POSTS_QUERY_KEYS.lists(), 'saved']
            });
            // Update UI list (vd icon trái tim)
            queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.lists() });
        },
    });
};

export const useUnsavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: unsavePost,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [...POSTS_QUERY_KEYS.lists(), 'saved']
            });
            queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.lists() });
        },
    });
};

export const useIncrementPostView = () => {
    return useMutation({ mutationFn: incrementView });
};