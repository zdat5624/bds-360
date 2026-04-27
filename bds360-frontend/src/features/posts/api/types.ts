// @/features/posts/api/types.ts

import { ListingType } from '@/constants';
import { BaseFilterParams } from '@/types';
import { CompassDirection, Furnishing, LegalStatus, PostStatus } from '../posts.constant';

// --- RESPONSE TYPES ---
export interface PostCategory {
    id: number;
    name: string;
}

export interface PostAuthor {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar?: string; // Full url
    isVerified: boolean;
    createdAt: string;
}

export interface PostVip {
    id: number;
    name: string;
    vipLevel: number;
}

export interface PostImage {
    id: number;
    url: string;
    orderIndex: number;
}

export interface ListingDetail {
    bedrooms?: number;
    bathrooms?: number;
    houseDirection?: CompassDirection;
    balconyDirection?: CompassDirection;
    legalStatus?: LegalStatus;
    furnishing?: Furnishing;
}

export interface Post {
    id: number;
    title: string;
    description: string;
    type: ListingType;
    price: number;
    area: number;
    view: number;
    status: PostStatus;
    expireDate?: string;
    createdAt: string;
    updatedAt?: string;

    pushedAt?: string;

    isHidden: boolean;

    deletedByUser: boolean;

    streetAddress: string;
    latitude?: number;
    longitude?: number;
    provinceCode: number;
    provinceName: string;
    districtCode: number;
    districtName: string;
    wardCode?: number;
    wardName?: string;

    category: PostCategory;
    user: PostAuthor;
    vip: PostVip;
    images: PostImage[];
    listingDetail?: ListingDetail;
}

// --- REQUEST PAYLOADS ---
export interface ListingDetailPayload {
    bedrooms?: number;
    bathrooms?: number;
    houseDirection?: CompassDirection;
    balconyDirection?: CompassDirection;
    legalStatus?: LegalStatus;
    furnishing?: Furnishing;
}

export interface PostCreatePayload {
    title: string;
    description: string;
    type: ListingType;
    price: number;
    area: number;
    categoryId: number;
    provinceCode: number;
    districtCode: number;
    wardCode?: number;
    streetAddress: string;
    vipId?: number;
    imageUrls: string[];
    listingDetail?: ListingDetailPayload;
    numberOfDays: number;
}

// @/features/posts/api/types.ts

export interface PostUpdatePayload {
    id: number;
    title: string;
    description: string;
    type: ListingType;
    price: number;
    area: number;

    //  SỬA LẠI THÀNH CÁC TRƯỜNG PHẲNG (FLAT) GIỐNG CREATE PAYLOAD
    categoryId: number;
    provinceCode: number;
    districtCode: number;
    wardCode?: number;
    streetAddress: string;
    latitude?: number;
    longitude?: number;

    //  SỬA LẠI ẢNH THÀNH MẢNG STRING
    imageUrls: string[];

    listingDetail?: ListingDetailPayload;
}

export interface UpdatePostStatusPayload {
    postId: number;
    status: PostStatus;
    message?: string;
    sendNotification: boolean;
}

export interface PostFilterParams extends BaseFilterParams {
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    statuses?: PostStatus[];
    categoryId?: number;
    type?: ListingType;
    provinceCode?: number;
    districtCode?: number;
    wardCode?: number;
    vipId?: number;

    userId?: number;
    userEmail?: string;

    search?: string;
    //  THÊM TRƯỜNG NÀY ĐỂ ĐỒNG BỘ VỚI BACKEND
    searchBy?: string[];

    isHidden?: boolean;

    isDeleteByUser?: boolean;
    isApprovedOnly?: boolean;
    bedrooms?: number;
    bathrooms?: number;
    houseDirection?: CompassDirection;
    balconyDirection?: CompassDirection;
    legalStatus?: LegalStatus;
    furnishing?: Furnishing;
}

//eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SavedPostFilterParams extends BaseFilterParams {
    // Thêm các field đặc thù nếu cần, BaseFilterParams đã có page, size, sortBy, sortDirection
}

// Nếu bạn muốn tracking thêm ngày lưu ở Frontend
export interface SavedPostResponse extends Post {
    savedAt?: string;
}

export interface PostViewChartResponse {
    date: string; // Có thể là "YYYY-MM-DD" (daily) hoặc "YYYY-MM" (monthly)
    views: number;
}

export interface MapPost {
    latitude: number;
    longitude: number;
    postId: number;
    vipId: number;
    price: number;
}


export interface PriceAnalyticsParams {
    type: ListingType; // Dùng luôn enum/type ListingType có sẵn của bạn
    categoryId?: number;
    provinceCode?: number;
    districtCode?: number;
    wardCode?: number;
    months?: number;
}

export interface PriceTrendItem {
    month: string;
    minPrice: number;
    maxPrice: number;
    avgPrice: number;
}

export interface PriceHistoryResponse {
    note?: string;
    summary: {
        currentAvgPrice: number;
        changePercent: number;
        peakPrice: number;
        peakMonth: string;
        dropFromPeakPercent: number;
    };
    trend: PriceTrendItem[];
}

export interface NearbyLocation {
    locationCode: number;
    locationName: string;
    avgPrice: number;
    activePostsCount: number;
    locationType: 'WARD' | 'DISTRICT';
}

export interface RelatedPostParams extends BaseFilterParams {
    excludeIds?: string;
}

export interface ForYouPostParams extends BaseFilterParams {
    type?: ListingType;
    excludeIds?: string;
}


export interface RenewPostPayload {
    id: number;
    numberOfDays: number;
    vipId?: number;
}