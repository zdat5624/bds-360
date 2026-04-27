import { z } from 'zod';

export const createPaymentSchema = z.object({
    amount: z.number({
        // Dùng 'message' thay cho 'invalid_type_error' theo yêu cầu của trình biên dịch
        message: 'Vui lòng nhập số tiền nạp hợp lệ',
    }).min(10000, 'Số tiền nạp tối thiểu là 10.000 VNĐ'),
});

export type CreatePaymentFormValues = z.infer<typeof createPaymentSchema>;