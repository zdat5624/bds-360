// @/features/vips/api/vips.queries.ts

import customFetch from '@/lib/custom-fetch';
import { useQuery } from '@tanstack/react-query';
import { Vip } from './types';

export const VIPS_QUERY_KEYS = {
    all: ['vips'] as const,
    lists: () => [...VIPS_QUERY_KEYS.all, 'list'] as const,
    // Thêm detail nếu sau này Backend có API getById
};

// Hàm Fetcher gọi API
const getVips = async (): Promise<Vip[]> => {
    return customFetch.get('/vips');
};

// Custom Hook dùng trong Component
export const useGetVips = () => {
    return useQuery({
        queryKey: VIPS_QUERY_KEYS.lists(),
        queryFn: getVips,
    });
};