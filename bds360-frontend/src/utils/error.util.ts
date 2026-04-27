// @/utils/error.util.ts

import { ApiError } from '@/types';
import { isAxiosError } from 'axios';

export const getErrorMessage = (error: unknown): string => {
    if (isAxiosError(error)) {
        const data = error.response?.data as ApiError | undefined;
        return data?.message || 'Có lỗi xảy ra kết nối mạng!';
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Lỗi hệ thống không xác định!';
};