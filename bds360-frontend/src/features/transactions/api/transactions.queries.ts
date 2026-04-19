// @/features/transactions/api/transactions.queries.ts

import customFetch from '@/lib/custom-fetch';
import { PageResponse } from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Transaction, TransactionFilterParams } from './types';

// Tách bạch hoàn toàn Query Keys của Admin và My (User)
export const TRANSACTIONS_QUERY_KEYS = {
    all: ['transactions'] as const,

    // Luồng User cá nhân
    myLists: () => [...TRANSACTIONS_QUERY_KEYS.all, 'my-lists'] as const,
    myList: (filters: TransactionFilterParams) => [...TRANSACTIONS_QUERY_KEYS.myLists(), filters] as const,

    // Luồng Admin
    adminLists: () => [...TRANSACTIONS_QUERY_KEYS.all, 'admin-lists'] as const,
    adminList: (filters: TransactionFilterParams) => [...TRANSACTIONS_QUERY_KEYS.adminLists(), filters] as const,

    // Chi tiết chung
    details: () => [...TRANSACTIONS_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: number) => [...TRANSACTIONS_QUERY_KEYS.details(), id] as const,
};

// --- API CALL FUNCTIONS ---
const getAdminTransactions = async (filters: TransactionFilterParams): Promise<PageResponse<Transaction>> => {
    return customFetch.get('/admin/transactions', { params: filters });
};

const getMyTransactions = async (filters: TransactionFilterParams): Promise<PageResponse<Transaction>> => {
    return customFetch.get('/transactions/my-transactions', { params: filters });
};

const getTransactionById = async (id: number): Promise<Transaction> => {
    return customFetch.get(`/transactions/${id}`);
};

// --- CUSTOM HOOKS ---

// 1. Hook dành riêng cho trang User
export const useGetMyTransactions = (filters: TransactionFilterParams) => {
    return useQuery({
        queryKey: TRANSACTIONS_QUERY_KEYS.myList(filters),
        queryFn: () => getMyTransactions(filters),
        placeholderData: keepPreviousData,
    });
};

// 2. Hook dành riêng cho trang Admin
export const useGetAdminTransactions = (filters: TransactionFilterParams) => {
    return useQuery({
        queryKey: TRANSACTIONS_QUERY_KEYS.adminList(filters),
        queryFn: () => getAdminTransactions(filters),
        placeholderData: keepPreviousData,

    });
};

// 3. Hook lấy chi tiết (có thể dùng chung nếu Backend cho phép)
export const useGetTransactionById = (id: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: TRANSACTIONS_QUERY_KEYS.detail(id),
        queryFn: () => getTransactionById(id),
        enabled,
    });
};