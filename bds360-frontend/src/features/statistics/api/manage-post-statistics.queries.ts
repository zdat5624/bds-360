// @/features/statistics/api/manage-post-statistics.queries.ts

import customFetch from '@/lib/custom-fetch';
import { useQuery } from '@tanstack/react-query';
import { ManagePostStatisticsResponse } from './manage-post-statistics.types';

// ==========================================
// 1. QUAN LY QUERY KEYS DE CACHE
// ==========================================
export const MANAGE_POST_STATISTICS_KEYS = {
    all: ['manage-post-statistics'] as const,
    dashboard: (days: number) => [...MANAGE_POST_STATISTICS_KEYS.all, 'dashboard', days] as const,
};

// ==========================================
// 2. API FETCHERS
// ==========================================
const getManagePostDashboardStats = async (days: number): Promise<ManagePostStatisticsResponse> => {
    // URL map voi Controller: /api/v1/manage/statistics/posts
    return customFetch.get('/manage/statistics/posts', { params: { days } });
};

// ==========================================
// 3. REACT QUERY HOOKS
// ==========================================
export const useGetManagePostDashboardStats = (days: number = 30, enabled: boolean = true) => {
    return useQuery({
        queryKey: MANAGE_POST_STATISTICS_KEYS.dashboard(days),
        queryFn: () => getManagePostDashboardStats(days),
        enabled,
        staleTime: 5 * 60 * 1000, // Cache du lieu trong 5 phut
    });
};