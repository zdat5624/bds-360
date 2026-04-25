// @/features/posts/api/posts.queries.ts

import customFetch from '@/lib/custom-fetch';
import { BaseFilterParams, PageResponse } from '@/types';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ForYouPostParams, MapPost, NearbyLocation, Post, PostFilterParams, PostViewChartResponse, PriceAnalyticsParams, PriceHistoryResponse, RelatedPostParams, SavedPostResponse } from './types';

export const POSTS_QUERY_KEYS = {
    all: ['posts'] as const,
    lists: () => [...POSTS_QUERY_KEYS.all, 'list'] as const,
    //  Scope 'admin' giờ dùng chung cho cả role MODERATOR trong logic code
    list: (scope: 'public' | 'admin' | 'my' | 'saved', filters: PostFilterParams | BaseFilterParams) =>
        [...POSTS_QUERY_KEYS.lists(), scope, filters] as const,
    map: (filters: PostFilterParams) => [...POSTS_QUERY_KEYS.all, 'map', filters] as const,
    details: () => [...POSTS_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: number) => [...POSTS_QUERY_KEYS.details(), id] as const,
    analytics: (id: number) => [...POSTS_QUERY_KEYS.detail(id), 'analytics'] as const,
    dailyViews: (id: number, days: number) => [...POSTS_QUERY_KEYS.analytics(id), 'daily', days] as const,
    monthlyViews: (id: number, months: number) => [...POSTS_QUERY_KEYS.analytics(id), 'monthly', months] as const,
    analyticsPrice: (params: PriceAnalyticsParams) => [...POSTS_QUERY_KEYS.all, 'analytics', 'price', params] as const,
    analyticsNearby: (params: PriceAnalyticsParams) => [...POSTS_QUERY_KEYS.all, 'analytics', 'nearby', params] as const,

    related: (id: number, params?: RelatedPostParams) => [...POSTS_QUERY_KEYS.detail(id), 'related', params] as const,

    checkSaved: (ids: number[]) => [...POSTS_QUERY_KEYS.all, 'saved', 'check', { ids }] as const,
    forYou: (params?: ForYouPostParams) => [...POSTS_QUERY_KEYS.all, 'forYou', params] as const,
};

const getPosts = async (scope: 'public' | 'admin' | 'my', filters: PostFilterParams): Promise<PageResponse<Post>> => {
    let endpoint = '/posts';
    //  Sửa đổi: Đổi đường dẫn API từ /admin thành /manage
    if (scope === 'admin') endpoint = '/manage/posts';
    if (scope === 'my') endpoint = '/posts/my-posts';

    return customFetch.get(endpoint, { params: filters });
};

const getPostsForMap = async (filters: PostFilterParams): Promise<MapPost[]> => {
    // Vì List trả về không có phần trang nên ta trả về thẳng mảng
    return customFetch.get('/posts/map', { params: filters });
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

export const useGetPosts = (scope: 'public' | 'admin' | 'my', filters: PostFilterParams, options?: Omit<
    UseQueryOptions<
        PageResponse<Post>, // data từ queryFn
        Error,              // error
        PageResponse<Post>, // data sau select
        ReturnType<typeof POSTS_QUERY_KEYS.list> // queryKey type
    >,
    'queryKey' | 'queryFn'
>) => {
    return useQuery({
        queryKey: POSTS_QUERY_KEYS.list(scope, filters),
        queryFn: () => getPosts(scope, filters),
        ...options
    });
};

export const useGetPostsForMap = (filters: PostFilterParams, enabled: boolean = true) => {
    return useQuery({
        queryKey: POSTS_QUERY_KEYS.map(filters),
        queryFn: () => getPostsForMap(filters),
        enabled: enabled, // Cho phép component tắt/bật việc gọi API bản đồ
        staleTime: 5 * 60 * 1000, // Optional: Cache bản đồ 5 phút để đỡ giật lag khi kéo map
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

// --- API FETCH FUNCTIONS CHO GIÁ & LÂN CẬN ---

const getPriceHistory = async (params: PriceAnalyticsParams): Promise<PriceHistoryResponse> => {
    // Đã bỏ '/api/v1' và trả về trực tiếp customFetch giống các hàm cũ của bạn
    return customFetch.get('/posts/analytics/price-history', { params });
};

const getNearbyLocations = async (params: PriceAnalyticsParams): Promise<NearbyLocation[]> => {
    // Đã bỏ '/api/v1'
    return customFetch.get('/posts/analytics/nearby-locations', { params });
};

// --- HOOKS ---

export const useGetPriceHistory = (params: PriceAnalyticsParams, enabled: boolean = true) => {
    return useQuery({
        // Thêm params vào QueryKey để React Query cache riêng biệt khi đổi bộ lọc
        queryKey: [...POSTS_QUERY_KEYS.all, 'analytics', 'price', params],
        queryFn: () => getPriceHistory(params),
        enabled: enabled && !!params.type,
    });
};

export const useGetNearbyLocations = (params: PriceAnalyticsParams, enabled: boolean = true) => {
    return useQuery({
        queryKey: [...POSTS_QUERY_KEYS.all, 'analytics', 'nearby', params],
        queryFn: () => getNearbyLocations(params),
        enabled: enabled && !!params.type,
    });
};

// 2. Viết hàm Fetch
const getRelatedPosts = async (id: number, params?: RelatedPostParams): Promise<PageResponse<Post>> => {
    return customFetch.get(`/posts/${id}/related`, { params });
};

const getForYouPosts = async (params?: ForYouPostParams): Promise<PageResponse<Post>> => {
    return customFetch.get('/posts/for-you', { params });
};

// 3. Export Hooks
export const useGetRelatedPosts = (id: number, params?: RelatedPostParams, enabled: boolean = true) => {
    return useQuery({
        queryKey: POSTS_QUERY_KEYS.related(id, params),
        queryFn: () => getRelatedPosts(id, params),
        enabled: enabled && !!id,
    });
};

export const useGetForYouPosts = (params?: ForYouPostParams, enabled: boolean = true) => {
    return useQuery({
        queryKey: POSTS_QUERY_KEYS.forYou(params),
        queryFn: () => getForYouPosts(params),
        enabled,
    });
};


const checkSavedStatus = async (postIds: number[]): Promise<Record<number, boolean>> => {
    return customFetch.post('/posts/saved/check', postIds);
};

export const useCheckSavedStatus = (postIds: number[], enabled: boolean = true) => {
    return useQuery({
        queryKey: POSTS_QUERY_KEYS.checkSaved(postIds),
        queryFn: () => checkSavedStatus(postIds),
        enabled: enabled && postIds.length > 0,

        // 🌟 ĐÂY LÀ BỘ ĐÔI HOÀN HẢO ĐỂ ĐỒNG BỘ TAB:
        staleTime: 0, // Vừa lấy về là cũ ngay, để sẵn sàng fetch lại
        refetchOnWindowFocus: true, // Khi click lại vào Tab là fetch ngay

        // Có thể thêm cái này nếu muốn đồng bộ cả khi mạng bị đứt rồi có lại
        refetchOnReconnect: true,
    });
};


