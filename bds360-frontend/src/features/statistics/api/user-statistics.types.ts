import { PostStatus } from "@/features/posts";

export interface KpiSummary {
    availableBalance: number;
    activePosts: number;
    totalViews: number;
    monthlySpending: number;
}

export interface ViewTrend {
    date: string; // Định dạng: YYYY-MM-DD
    views: number;
}

export interface PostStatusBreakdown {
    status: PostStatus;
    count: number;
}

export interface TopPost {
    postId: number;
    title: string;
    views: number;
    vipName: string;
    badgeColor?: string;
}

export interface CashFlow {
    month: string; // Định dạng: YYYY-MM
    depositAmount: number;
    paymentAmount: number;
}