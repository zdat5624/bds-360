// @/features/statistics/api/manage-transaction-statistics.queries.ts

import customFetch from '@/lib/custom-fetch';
import { useQuery } from '@tanstack/react-query';
import { ManageTransactionStatisticsResponse } from './manage-transaction-statistics.types';

// ==========================================
// 1. QUẢN LÝ QUERY KEYS ĐỂ CACHE
// ==========================================
export const MANAGE_TRANSACTION_STATISTICS_KEYS = {
    all: ['manage-transaction-statistics'] as const,
    dashboard: (days: number) => [...MANAGE_TRANSACTION_STATISTICS_KEYS.all, 'dashboard', days] as const,
};

// ==========================================
// 2. API FETCHERS
// ==========================================
const getManageTransactionDashboardStats = async (days: number): Promise<ManageTransactionStatisticsResponse> => {
    // URL map với Controller: /api/v1/manage/statistics/transactions
    return customFetch.get('/manage/statistics/transactions', { params: { days } });
};

// ==========================================
// 3. REACT QUERY HOOKS
// ==========================================
export const useGetManageTransactionDashboardStats = (days: number = 30, enabled: boolean = true) => {
    return useQuery({
        queryKey: MANAGE_TRANSACTION_STATISTICS_KEYS.dashboard(days),
        queryFn: () => getManageTransactionDashboardStats(days),
        enabled,
        staleTime: 5 * 60 * 1000, // Cache dữ liệu trong 5 phút để tránh call API liên tục
    });
};