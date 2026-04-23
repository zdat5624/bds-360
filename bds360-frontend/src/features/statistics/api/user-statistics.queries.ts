import customFetch from '@/lib/custom-fetch';
import { useQuery } from '@tanstack/react-query';
import { CashFlow, KpiSummary, PostStatusBreakdown, TopPost, ViewTrend } from './user-statistics.types';

// ==========================================
// 1. QUẢN LÝ QUERY KEYS ĐỂ CACHE
// ==========================================
export const USER_STATISTICS_KEYS = {
    all: ['user-statistics'] as const,
    kpis: () => [...USER_STATISTICS_KEYS.all, 'kpis'] as const,
    views: (days: number) => [...USER_STATISTICS_KEYS.all, 'views', days] as const,
    postStatuses: () => [...USER_STATISTICS_KEYS.all, 'post-statuses'] as const,
    topPosts: (limit: number) => [...USER_STATISTICS_KEYS.all, 'top-posts', limit] as const,
    cashFlow: (months: number) => [...USER_STATISTICS_KEYS.all, 'cash-flow', months] as const,
};

// ==========================================
// 2. API FETCHERS
// ==========================================
const getKpiSummary = async (): Promise<KpiSummary> => {
    return customFetch.get('/users/statistics/kpis');
};

const getViewsChart = async (days: number): Promise<ViewTrend[]> => {
    return customFetch.get('/users/statistics/charts/views', { params: { days } });
};

const getPostStatusBreakdown = async (): Promise<PostStatusBreakdown[]> => {
    return customFetch.get('/users/statistics/charts/post-statuses');
};

const getTopPosts = async (limit: number): Promise<TopPost[]> => {
    return customFetch.get('/users/statistics/charts/top-posts', { params: { limit } });
};

const getCashFlowChart = async (months: number): Promise<CashFlow[]> => {
    return customFetch.get('/users/statistics/charts/cash-flow', { params: { months } });
};

// ==========================================
// 3. REACT QUERY HOOKS
// ==========================================
export const useGetUserKpiSummary = (enabled: boolean = true) => {
    return useQuery({
        queryKey: USER_STATISTICS_KEYS.kpis(),
        queryFn: getKpiSummary,
        enabled,
    });
};

export const useGetUserViewsChart = (days: number = 30, enabled: boolean = true) => {
    return useQuery({
        queryKey: USER_STATISTICS_KEYS.views(days),
        queryFn: () => getViewsChart(days),
        enabled,
    });
};

export const useGetPostStatusBreakdown = (enabled: boolean = true) => {
    return useQuery({
        queryKey: USER_STATISTICS_KEYS.postStatuses(),
        queryFn: getPostStatusBreakdown,
        enabled,
    });
};

export const useGetTopPosts = (limit: number = 5, enabled: boolean = true) => {
    return useQuery({
        queryKey: USER_STATISTICS_KEYS.topPosts(limit),
        queryFn: () => getTopPosts(limit),
        enabled,
    });
};

export const useGetCashFlowChart = (months: number = 6, enabled: boolean = true) => {
    return useQuery({
        queryKey: USER_STATISTICS_KEYS.cashFlow(months),
        queryFn: () => getCashFlowChart(months),
        enabled,
    });
};