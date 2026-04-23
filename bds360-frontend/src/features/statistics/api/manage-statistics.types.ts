export interface AdminStatisticsResponse {
    totalRevenueYear: number;
    totalRevenueMonth: number;
    totalUsers: number;
    pendingPosts: number;
}

export interface MonthlyRevenueResponse {
    month: number;
    revenue: number;
}