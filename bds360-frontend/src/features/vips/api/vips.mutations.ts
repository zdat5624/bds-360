// @/features/vips/api/vips.mutations.ts

import customFetch from '@/lib/custom-fetch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateVipPricePayload, Vip } from './types';
import { VIPS_QUERY_KEYS } from './vips.queries';

// Hàm Fetcher
const updateVipPrice = async ({ id, newPrice }: UpdateVipPricePayload): Promise<Vip> => {
    // Gửi id lên param URL, phần body chỉ chứa newPrice
    return customFetch.put(`/admin/vips/${id}/price`, { newPrice });
};

// Custom Hook dùng cho Form Cập nhật giá
export const useUpdateVipPrice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateVipPrice,
        onSuccess: () => {
            // Làm mới lại danh sách VIP sau khi cập nhật giá thành công
            queryClient.invalidateQueries({ queryKey: VIPS_QUERY_KEYS.lists() });
        },
    });
};