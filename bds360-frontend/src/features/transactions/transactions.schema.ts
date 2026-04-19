// @/features/transactions/transactions.schema.ts

import { z } from 'zod';

export const createPaymentSchema = z.object({
    amount: z.coerce.number({
        message: 'Vui lòng nhập số tiền hợp lệ',
    }).min(10000, 'Số tiền nạp tối thiểu là 10.000 VNĐ'),
});

export type CreatePaymentFormValues = z.infer<typeof createPaymentSchema>;