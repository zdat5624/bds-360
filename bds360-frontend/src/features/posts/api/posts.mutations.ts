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

const deleteAdminPost = async (id: number): Promise<void> => {
    return customFetch.delete(`/admin/posts/${id}`);
};

const updatePostStatus = async (payload: UpdatePostStatusPayload): Promise<Post> => {
    return customFetch.put('/admin/posts/status', payload);
};

// --- HOOKS ---

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            // Làm mới danh sách khi tạo tin
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