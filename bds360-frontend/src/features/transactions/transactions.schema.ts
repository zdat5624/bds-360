// @/features/transactions/transactions.schema.ts

import { z } from 'zod';

export const createPaymentSchema = z.object({

    amount: z.coerce.number({
        message: 'Số tiền nạp không được để trống và phải là số hợp lệ'
    }).min(10000, 'Số tiền nạp tối thiểu là 10.000 VNĐ'),
});

export type CreatePaymentFormValues = z.infer<typeof createPaymentSchema>;