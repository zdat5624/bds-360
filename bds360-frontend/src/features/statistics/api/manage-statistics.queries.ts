// @/features/statistics/api/manage-statistics.queries.ts

import customFetch from '@/lib/custom-fetch';
import { useQuery } from '@tanstack/react-query';
import { AdminStatisticsResponse, MonthlyRevenueResponse } from './manage-statistics.types';

export const STATISTICS_QUERY_KEYS = {
    all: ['statistics'] as const,
    overview: () => [...STATISTICS_QUERY_KEYS.all, 'overview'] as const,
    monthlyRevenue: (year: number) => [...STATISTICS_QUERY_KEYS.all, 'monthly-revenue', year] as const,
};

const getAdminStatistics = async (): Promise<AdminStatisticsResponse> => {
    return customFetch.get('/admin/statistics');
};

const getMonthlyRevenue = async (year: number): Promise<MonthlyRevenueResponse[]> => {
    return customFetch.get('/admin/statistics/revenue-by-month', { params: { year } });
};

// Lấy 4 thẻ số tổng quan trên cùng
export const useGetAdminStatistics = () => {
    return useQuery({
        queryKey: STATISTICS_QUERY_KEYS.overview(),
        queryFn: getAdminStatistics,
        // Thông thường Dashboard không cần refetch quá thường xuyên, có thể tăng staleTime
        staleTime: 5 * 60 * 1000, // 5 phút
    });
};

// Lấy dữ liệu cho biểu đồ cột/đường
export const useGetMonthlyRevenue = (year: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: STATISTICS_QUERY_KEYS.monthlyRevenue(year),
        queryFn: () => getMonthlyRevenue(year),
        enabled,
    });
};