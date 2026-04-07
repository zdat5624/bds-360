// @/utils/error.util.ts
import { isAxiosError } from 'axios';

/**
 * Bóc tách câu thông báo lỗi từ phía Backend trả về
 */
export const getErrorMessage = (error: unknown): string => {
    if (isAxiosError(error)) {
        // Tùy chỉnh theo cấu trúc JSON mà Spring Boot của bạn trả về
        return error.response?.data?.message || error.response?.data?.error || 'Có lỗi xảy ra kết nối mạng!';
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Lỗi hệ thống không xác định!';
};