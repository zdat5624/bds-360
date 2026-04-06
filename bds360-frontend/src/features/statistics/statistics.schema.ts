// @/features/statistics/statistics.schema.ts

import { z } from 'zod';

export const monthlyRevenueFilterSchema = z.object({
    year: z.coerce.number({
        message: 'Năm phải là số hợp lệ'
    }).min(2000, 'Năm phải lớn hơn hoặc bằng 2000'),
});

export type MonthlyRevenueFilterValues = z.infer<typeof monthlyRevenueFilterSchema>;