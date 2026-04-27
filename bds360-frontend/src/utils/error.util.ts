// @/utils/error.util.ts

import { ApiError } from '@/types';
import { isAxiosError } from 'axios';

// export const getErrorMessage = (error: unknown): string => {
//     if (isAxiosError(error)) {
//         const data = error.response?.data as ApiError | undefined;
//         return data?.message || 'Có lỗi xảy ra kết nối mạng!';
//     }

//     if (error instanceof Error) {
//         return error.message;
//     }

//     return 'Lỗi hệ thống không xác định!';
// };


export const getErrorMessage = (error: unknown): string => {
    // 1. Luồng chính: Lỗi đã được bóc vỏ từ custom-fetch.ts (ApiError)
    // Kiểm tra xem error có phải là object và có chứa field 'message' từ Backend không
    if (error && typeof error === 'object' && 'message' in error) {
        return (error as ApiError).message;
    }

    // 2. Luồng phòng hờ: Lọt lưới một AxiosError nguyên thủy chưa bị bóc
    if (isAxiosError(error)) {
        const data = error.response?.data as ApiError | undefined;
        return data?.message || error.message || 'Có lỗi xảy ra kết nối mạng!';
    }

    // 3. Lỗi JavaScript nguyên thủy (VD: syntax error, null reference)
    if (error instanceof Error) {
        return error.message;
    }

    // 4. Fallback cuối cùng
    return 'Lỗi hệ thống không xác định!';
};