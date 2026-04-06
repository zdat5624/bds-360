// @/features/media/media.schema.ts

import { z } from 'zod';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from './media.constant';

export const uploadMediaSchema = z.object({
    files: z.array(z.custom<File>(), { message: 'Danh sách tệp không hợp lệ' })
        .min(1, 'Vui lòng chọn ít nhất 1 tệp')
        .refine(
            (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
            { message: 'Kích thước tệp tối đa không được vượt quá 50MB' }
        ),
});

export const uploadImageSchema = uploadMediaSchema.extend({
    files: z.array(z.custom<File>(), { message: 'Danh sách tệp không hợp lệ' })
        .min(1, 'Vui lòng chọn ít nhất 1 ảnh')
        .refine(
            (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
            { message: 'Kích thước ảnh tối đa không được vượt quá 50MB' }
        )
        .refine(
            (files) => files.every((file) => ALLOWED_IMAGE_TYPES.includes(file.type)),
            { message: 'Định dạng ảnh không được hỗ trợ' }
        ),
});

export type UploadMediaFormValues = z.infer<typeof uploadMediaSchema>;
export type UploadImageFormValues = z.infer<typeof uploadImageSchema>;