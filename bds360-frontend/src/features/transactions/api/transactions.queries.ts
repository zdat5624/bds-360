// @/features/transactions/api/transactions.queries.ts

import customFetch from '@/lib/custom-fetch';
import { PageResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Transaction, TransactionFilterRequest } from './types';

export const TRANSACTIONS_QUERY_KEYS = {
    all: ['transactions'] as const,
    lists: () => [...TRANSACTIONS_QUERY_KEYS.all, 'list'] as const,
    list: (filters: TransactionFilterRequest) => [...TRANSACTIONS_QUERY_KEYS.lists(), filters] as const,
    details: () => [...TRANSACTIONS_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: number) => [...TRANSACTIONS_QUERY_KEYS.details(), id] as const,
};

const getAdminTransactions = async (filters: TransactionFilterRequest): Promise<PageResponse<Transaction>> => {
    return customFetch.get('/admin/transactions', { params: filters });
};

const getMyTransactions = async (filters: TransactionFilterRequest): Promise<PageResponse<Transaction>> => {
    return customFetch.get('/transactions/my-transactions', { params: filters });
};

const getTransactionById = async (id: number): Promise<Transaction> => {
    return customFetch.get(`/transactions/${id}`);
};

// Hook lấy danh sách: Tích hợp cờ isAdmin để tự động rẽ nhánh gọi API tương ứng
export const useGetTransactions = (filters: TransactionFilterRequest, isAdmin: boolean = false) => {
    return useQuery({
        queryKey: [...TRANSACTIONS_QUERY_KEYS.list(filters), { isAdmin }],
        queryFn: () => isAdmin ? getAdminTransactions(filters) : getMyTransactions(filters),
    });
};

export const useGetTransactionById = (id: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: TRANSACTIONS_QUERY_KEYS.detail(id),
        queryFn: () => getTransactionById(id),
        enabled,
    });
};