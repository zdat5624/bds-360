// @/features/vips/vips.schema.ts

import { z } from 'zod';

export const updateVipPriceSchema = z.object({
    id: z.number(),
    newPrice: z.coerce.number({
        message: 'Giá mới không được để trống và phải là số hợp lệ',
    }).min(0, 'Giá gói VIP không được nhỏ hơn 0'),
});

export type UpdateVipPriceFormValues = z.infer<typeof updateVipPriceSchema>;