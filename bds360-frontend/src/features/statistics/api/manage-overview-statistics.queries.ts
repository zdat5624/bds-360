// @/features/statistics/api/manage-overview-statistics.queries.ts

import customFetch from '@/lib/custom-fetch';
import { useQuery } from '@tanstack/react-query';
import { SystemOverviewResponse } from './manage-overview-statistics.types';

// ==========================================
// 1. QUAN LY QUERY KEYS DE CACHE
// ==========================================
export const MANAGE_OVERVIEW_STATISTICS_KEYS = {
    all: ['manage-overview-statistics'] as const,
    dashboard: (days: number) => [...MANAGE_OVERVIEW_STATISTICS_KEYS.all, 'dashboard', days] as const,
};

// ==========================================
// 2. API FETCHERS
// ==========================================
const getSystemOverviewStats = async (days: number): Promise<SystemOverviewResponse> => {
    // URL map voi Controller: /api/v1/manage/statistics/overview
    return customFetch.get('/manage/statistics/overview', { params: { days } });
};

// ==========================================
// 3. REACT QUERY HOOKS
// ==========================================
export const useGetSystemOverviewStats = (days: number = 30, enabled: boolean = true) => {
    return useQuery({
        queryKey: MANAGE_OVERVIEW_STATISTICS_KEYS.dashboard(days),
        queryFn: () => getSystemOverviewStats(days),
        enabled,
        staleTime: 5 * 60 * 1000, // Cache du lieu trong 5 phut
    });
};