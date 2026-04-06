// @/features/addresses/addresses.schema.ts

import { z } from 'zod';

export const geocodeSchema = z.object({
    address: z.string({ message: 'Địa chỉ không được để trống' })
        .min(1, 'Vui lòng nhập địa chỉ cần tìm kiếm trên bản đồ'),
});

export type GeocodeFormValues = z.infer<typeof geocodeSchema>;