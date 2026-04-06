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
    avatar?: string;
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
    vip?: PostVip;
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

export interface PostUpdatePayload {
    id: number;
    title: string;
    description: string;
    type: ListingType;
    price: number;
    area: number;
    streetAddress: string;
    latitude?: number;
    longitude?: number;
    // Payload dựa theo class Entity lồng nhau của Java
    province?: { code: number };
    district?: { code: number };
    ward?: { code: number };
    category?: { id: number };
    images?: { url: string; orderIndex: number }[];
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
    status?: PostStatus;
    categoryId?: number;
    type?: ListingType;
    provinceCode?: number;
    districtCode?: number;
    wardCode?: number;
    vipId?: number;
    search?: string;
    isDeleteByUser?: boolean;
    isApprovedOnly?: boolean;
    bedrooms?: number;
    bathrooms?: number;
    direction?: CompassDirection;
    balconyDirection?: CompassDirection;
    legalStatus?: LegalStatus;
    furnishing?: Furnishing;
}