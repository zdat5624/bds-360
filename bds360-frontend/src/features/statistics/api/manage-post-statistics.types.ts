// @/features/statistics/api/manage-post-statistics.types.ts

import { ListingType } from '@/constants';

export interface ManagePostStatisticsResponse {
    kpis: PostKpiSummary;
    supplyTrend: PostGrowthTrend[];
    demandStructure: ListingTypeStats[];
    topProvinces: ProvinceStats[];
    topViewedPosts: PostLogDto[];
    latestVipPosts: PostLogDto[];
}

export interface PostKpiSummary {
    activeListings: number;
    newPosts: number;
    newPostsGrowthPercent: number;
    moderationBacklog: number;
    vipRatio: number;
}

export interface PostGrowthTrend {
    date: string; // Format: YYYY-MM-DD
    count: number;
}

export interface ListingTypeStats {
    type: ListingType;
    count: number;
}

export interface ProvinceStats {
    name: string;
    count: number;
}

export interface PostLogDto {
    id: number;
    title: string;
    views: number;
    listingType: ListingType;
    userName: string;
    vipLevel: number;
    createdAt: string; // ISO String
    userAvatar: string; // ISO String
}