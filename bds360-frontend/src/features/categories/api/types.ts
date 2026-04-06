// @/features/categories/api/types.ts

import { ListingType } from '@/constants';
import { BaseFilterParams } from '@/types';

export interface Category {
    id: number;
    name: string;
    type: ListingType;
}

export interface CategoryCreatePayload {
    name: string;
    type: ListingType;
}

export interface CategoryUpdatePayload {
    id: number;
    name: string;
    type: ListingType;
}

export interface CategoryFilterParams extends BaseFilterParams {
    name?: string;
    type?: ListingType;
}