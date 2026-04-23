// @/features/statistics/api/manage-user-statistics.queries.ts

import customFetch from '@/lib/custom-fetch';
import { useQuery } from '@tanstack/react-query';
import { ManageUserStatisticsResponse } from './manage-user-statistics.types';

// ==========================================
// 1. QUẢN LÝ QUERY KEYS ĐỂ CACHE
// ==========================================
export const MANAGE_USER_STATISTICS_KEYS = {
    all: ['manage-user-statistics'] as const,
    dashboard: (days: number) => [...MANAGE_USER_STATISTICS_KEYS.all, 'dashboard', days] as const,
};

// ==========================================
// 2. API FETCHERS
// ==========================================
const getManageUserDashboardStats = async (days: number): Promise<ManageUserStatisticsResponse> => {
    // Gọi đến Controller vừa tạo: /api/v1/manage/statistics/users
    return customFetch.get('/manage/statistics/users', { params: { days } });
};

// ==========================================
// 3. REACT QUERY HOOKS
// ==========================================
export const useGetManageUserDashboardStats = (days: number = 30, enabled: boolean = true) => {
    return useQuery({
        queryKey: MANAGE_USER_STATISTICS_KEYS.dashboard(days),
        queryFn: () => getManageUserDashboardStats(days),
        enabled,
        // Dữ liệu Admin không cần refetch liên tục, giữ nguyên trong 5 phút
        staleTime: 5 * 60 * 1000,
    });
};