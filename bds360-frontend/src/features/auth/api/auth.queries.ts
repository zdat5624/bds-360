// @/features/auth/api/auth.queries.ts

import { UserResponse } from '@/features/users';
import customFetch from '@/lib/custom-fetch';
import { useQuery } from '@tanstack/react-query';

export const AUTH_QUERY_KEYS = {
    all: ['auth'] as const,
    account: () => [...AUTH_QUERY_KEYS.all, 'account'] as const,
};

const getAccount = async (): Promise<UserResponse> => {
    return customFetch.get('/auth/account');
};

export const useGetAccount = (enabled: boolean = true) => {
    return useQuery({
        queryKey: AUTH_QUERY_KEYS.account(),
        queryFn: getAccount,
        enabled, // Rất quan trọng: Chỉ gọi API này khi đã có Token
    });
};