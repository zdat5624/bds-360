// @/features/notifications/notifications.schema.ts

import { z } from 'zod';

export const viewPhoneNotificationSchema = z.object({
    postId: z.number({ message: 'ID bài đăng không hợp lệ' }),
    recipientId: z.number({ message: 'ID người nhận không hợp lệ' }),
});

export type ViewPhoneNotificationFormValues = z.infer<typeof viewPhoneNotificationSchema>;