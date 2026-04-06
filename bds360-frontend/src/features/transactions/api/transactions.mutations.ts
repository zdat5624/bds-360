// @/features/transactions/api/transactions.mutations.ts

import customFetch from '@/lib/custom-fetch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TRANSACTIONS_QUERY_KEYS } from './transactions.queries';
import { CreatePaymentPayload, PaymentLink } from './types';

const createPayment = async (payload: CreatePaymentPayload): Promise<PaymentLink> => {
    return customFetch.post('/payment/create', payload);
};

export const useCreatePayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPayment,
        onSuccess: () => {
            // Invalidate danh sách giao dịch để khi user quay lại từ VNPAY, list tự được làm mới
            queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.lists() });
        },
    });
};