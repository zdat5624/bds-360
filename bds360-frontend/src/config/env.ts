// --- src/config/env.ts ---
import { z } from 'zod';

// 1. Định nghĩa Schema cho các biến môi trường
const envSchema = z.object({
    // Client-side envs (Có chữ NEXT_PUBLIC_)
    NEXT_PUBLIC_API_URL: z.string().url("API URL phải là một đường dẫn hợp lệ"),
    NEXT_PUBLIC_WS_URL: z.string().url("Websocket URL phải là một đường dẫn hợp lệ"),

    NEXT_PUBLIC_MAPBOX_KEY: z.string().min(1, "Mapbox key không được để trống"),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1, "Google Client ID không được để trống"),

    // Server-side envs (Tùy chọn, thêm vào nếu bạn dùng SSR/Server Actions)
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// 2. Validate dữ liệu thực tế từ process.env
const envParsed = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
    NEXT_PUBLIC_MAPBOX_KEY: process.env.NEXT_PUBLIC_MAPBOX_KEY,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NODE_ENV: process.env.NODE_ENV,
});

if (!envParsed.success) {
    console.error("Lỗi cấu hình biến môi trường (.env):", envParsed.error.format());
    throw new Error("Invalid environment variables");
}

// 3. Export config đã được làm sạch và có Type-safety (Autocomplete)
export const envConfig = envParsed.data;