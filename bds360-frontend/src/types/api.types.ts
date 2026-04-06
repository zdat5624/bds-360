// @/types/api.types.ts

// Tương ứng với record FieldErrorDetail trong ApiResponse.java
export interface FieldErrorDetail {
    field: string;
    message: string;
}

// Tương ứng với class ApiResponse<T>
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
    validationErrors?: FieldErrorDetail[];
}

// Tương ứng với class PageResponse<T>
export interface PageResponse<T> {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
    content: T[];
}

// Tương ứng với class BaseFilterRequest
export interface BaseFilterRequest {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
}