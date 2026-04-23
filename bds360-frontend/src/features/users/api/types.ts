// @/features/users/api/types.ts

import { BaseFilterParams } from '@/types';

import { Gender, Role } from '@/constants';
import { VerificationStatus } from '../users.constant';



export interface CreateUserPayload {
    name: string;
    email: string;
    password?: string;
    phone: string;
    role: Role;
    gender: Gender;
    address?: string;
    avatar: string;
}

export interface UpdateUserPayload {
    id: number;
    name: string;
    role: Role;
    gender: Gender;
    avatar?: string;
    phone: string;
    address?: string;
}

export interface UpdateProfilePayload {
    id: number;
    name: string;
    gender: Gender;
    avatar?: string;
    phone: string;
    address?: string;
}

export interface UserFilterParams extends BaseFilterParams {
    name?: string;
    email?: string;
    role?: Role;
    gender?: Gender;
    phone?: string;
    minBalance?: number;
    maxBalance?: number;
    address?: string;
    createdFrom?: string;
    createdTo?: string;
}


// ==========================================
// THÊM MỚI: TYPES CHO VERIFICATION
// ==========================================

export interface VerificationSubmission {
    id: number;
    userId: number;
    userAvatar: string;
    userName: string;
    userEmail: string;
    idCardFront: string;
    idCardBack: string;
    status: VerificationStatus;
    reviewNote?: string;
    createdAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
}

export interface SubmitVerificationPayload {
    idCardFront: string;
    idCardBack: string;
}

export interface ReviewVerificationPayload {
    requestId: number;
    status: VerificationStatus;
    note?: string;
}

export interface VerificationFilterParams extends BaseFilterParams {
    status?: VerificationStatus;
    search?: string;
}