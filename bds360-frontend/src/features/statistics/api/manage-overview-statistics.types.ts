// @/features/statistics/api/manage-overview-statistics.types.ts

// Dùng chung type TopSpender từ màn thống kê dòng tiền
import { TopSpender } from './manage-transaction-statistics.types';
// Dùng chung type PostLogDto từ màn thống kê tin đăng
import { PostLogDto } from './manage-post-statistics.types';

export interface SystemOverviewResponse {
    kpis: OverviewKpiSummary;
    backlog: OperationsBacklog;
    macroTrends: MacroTrend[];
    vipDistributions: VipDistribution[];
    topSpenders: TopSpender[];
    topPosts: PostLogDto[];
}

export interface OverviewKpiSummary {
    totalRevenue: number;
    revenueGrowthPercent: number;
    activeUsers: number;
    activeListings: number;
    vipConversionRate: number;
}

export interface OperationsBacklog {
    pendingPosts: number;
    pendingVerifications: number;
    pendingDeposits: number;
}

export interface MacroTrend {
    date: string; // Format: YYYY-MM-DD
    revenue: number;
    newUsers: number;
}

export interface VipDistribution {
    vipLevel: number;
    count: number;
}