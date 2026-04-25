// @/features/posts/api/posts.mutations.ts

import customFetch from '@/lib/custom-fetch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { POSTS_QUERY_KEYS } from './posts.queries';
import { Post, PostCreatePayload, PostUpdatePayload, RenewPostPayload, UpdatePostStatusPayload } from './types';

const createPost = async (payload: PostCreatePayload): Promise<Post> => {
    return customFetch.post('/posts', payload);
};

const updatePost = async (payload: PostUpdatePayload): Promise<Post> => {
    return customFetch.put('/posts', payload);
};

const deletePost = async (id: number): Promise<void> => {
    return customFetch.delete(`/posts/${id}`);
};

//  Sửa đổi: Đổi /admin thành /manage cho đồng bộ với Backend mới
const deleteAdminPost = async (id: number): Promise<void> => {
    return customFetch.delete(`/manage/posts/${id}`);
};

//  Sửa đổi: Đổi /admin thành /manage cho đồng bộ với Backend mới
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

const togglePostVisibility = async ({ id, isHidden }: { id: number; isHidden: boolean }): Promise<Post> => {
    // Dùng params để truyền isHidden lên URL (vd: /api/v1/posts/1/visibility?isHidden=true)
    return customFetch.put(`/posts/${id}/visibility`, null, { params: { isHidden } });
};

const renewPost = async ({ id, ...payload }: RenewPostPayload): Promise<Post> => {
    return customFetch.put(`/posts/${id}/renew`, payload);
};

// 🌟 THÊM HÀM GỌI API ĐẨY TIN
const bumpPost = async (id: number): Promise<Post> => {
    return customFetch.put(`/posts/${id}/bump`);
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
        onSuccess: (_, postId) => {
            // 1. Đồng bộ tức thì cho các Button lẻ (Manual Update)
            // Key sinh ra: ['posts', 'saved', 'check', { ids: [postId] }]
            queryClient.setQueryData(POSTS_QUERY_KEYS.checkSaved([postId]), { [postId]: true });

            // 2. Ép các danh sách Batch Check (20-30 IDs) phải load lại bản mới nhất
            queryClient.invalidateQueries({
                queryKey: [...POSTS_QUERY_KEYS.all, 'saved', 'check'],
                exact: false // Xóa tất cả query có prefix này
            });

            // 3. Làm mới toàn bộ danh sách "Tin đã lưu" (Trang cá nhân)
            queryClient.invalidateQueries({
                queryKey: [...POSTS_QUERY_KEYS.lists(), 'saved']
            });
        },
    });
};

export const useUnsavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: unsavePost,
        onSuccess: (_, postId) => {
            // Cập nhật thủ công sang false
            queryClient.setQueryData(POSTS_QUERY_KEYS.checkSaved([postId]), { [postId]: false });

            queryClient.invalidateQueries({
                queryKey: [...POSTS_QUERY_KEYS.all, 'saved', 'check'],
                exact: false
            });

            queryClient.invalidateQueries({
                queryKey: [...POSTS_QUERY_KEYS.lists(), 'saved']
            });
        },
    });
};

export const useIncrementPostView = () => {
    return useMutation({ mutationFn: incrementView });
};

export const useTogglePostVisibility = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: togglePostVisibility,
        onSuccess: (_, variables) => {
            // Làm mới lại danh sách (vd: bảng "Tin của tôi")
            queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.lists() });
            // Làm mới lại trang chi tiết tin nếu người dùng đang đứng xem
            queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.detail(variables.id) });
        },
    });
};


export const useRenewPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: renewPost,
        onSuccess: (_, variables) => {
            // Cập nhật lại danh sách bài đăng cá nhân
            queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.lists() });
            // Cập nhật lại cache chi tiết bài đăng đó
            queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.detail(variables.id) });
        },
    });
};

// 🌟 HOOK ĐẨY TIN (BUMP)
export const useBumpPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: bumpPost,
        onSuccess: (_, id) => {
            // Làm mới danh sách để thấy bài đăng nhảy lên top
            queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.detail(id) });
        },
    });
};