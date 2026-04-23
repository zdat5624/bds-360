// @/features/statistics/api/manage-user-statistics.types.ts

export interface ManageUserStatisticsResponse {
    kpis: KpiSummary;
    growthTrend: UserGrowthTrend[];
    behaviorStats: UserBehaviorStats;
    prestigeStats: UserPrestigeStats;
    topAgents: TopAgent[];
}

export interface KpiSummary {
    totalUsers: number;
    newUsers: number;
    newUserGrowthPercent: number; // % tăng/giảm (có thể âm)
    verificationRate: number;     // Tỷ lệ %
    activeUsers: number;
}

export interface UserGrowthTrend {
    date: string; // YYYY-MM-DD
    newUsers: number;
}

export interface UserBehaviorStats {
    postersCount: number; // Người đăng tin
    viewersCount: number; // Tài khoản chỉ xem
}

export interface UserPrestigeStats {
    verifiedCount: number;
    unverifiedCount: number;
}

export interface TopAgent {
    userId: number;
    name: string;
    email: string;
    activePostCount: number;
}