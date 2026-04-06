// @/features/users/api/types.ts

import { BaseFilterParams } from '@/types';

import { Gender, Role } from '@/constants';

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    gender: Gender;
    balance: number;
    phone: string;
    address?: string;
    avatar?: string;
    createdAt: string;
    createdBy: string;
    updatedAt?: string;
    updatedBy?: string;
}

export interface CreateUserPayload {
    name: string;
    email: string;
    password?: string;
    phone: string;
    role: Role;
    gender: Gender;
    address?: string;
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