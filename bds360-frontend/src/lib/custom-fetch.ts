// @/lib/custom-fetch.ts

import { envConfig } from '@/config';
import { ApiError, ApiResponse } from '@/types';
import { authStorage } from '@/utils';
import { message } from 'antd';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const isDev = envConfig.NODE_ENV === 'development';
const SUCCESS_CODE = 10000;

// =========================================================================
// 1. KHỞI TẠO INSTANCE (Chỉ dùng nội bộ trong file này)
// =========================================================================
const axiosInstance = axios.create({
    baseURL: envConfig.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// =========================================================================
// 2. INTERCEPTORS: Xử lý Token và chặn lỗi tập trung
// =========================================================================

// --- REQUEST INTERCEPTOR ---
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = authStorage.getToken();

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Delay test loading trong môi trường dev (Có thể xóa nếu không cần)
        // if (isDev) {
        //     await new Promise((resolve) => setTimeout(resolve, 300));
        // }

        return config;
    },
    (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
axiosInstance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        // Dự phòng object rỗng để tránh lỗi Cannot destructure property nếu BE trả về 204 No Content
        const responseData = response.data || {};
        const { code, message: msg } = responseData;

        // [A] Luồng Thành Công: Trả về nguyên si Response để Wrapper bên dưới tự bóc tách
        if (response.status === 204 || code === SUCCESS_CODE) {
            return response;
        }

        // [B] Luồng Lỗi Business (Code khác 10000)
        if (typeof window !== 'undefined' && isDev) {
            message.error(msg || 'Có lỗi nghiệp vụ xảy ra từ hệ thống!');
        }

        // Ép kiểu về ApiError để Frontend dễ dàng hứng ở catch()
        return Promise.reject(responseData as ApiError);
    },
    (error: AxiosError<ApiResponse>) => {
        // [C] Luồng Lỗi Hệ Thống (HTTP 400, 401, 403, 500, v.v...)
        if (error.response?.status === 401) {
            const requestUrl = error.config?.url || '';
            const isAuthAPI = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/google');

            if (!isAuthAPI) {
                authStorage.clearAuth();
                if (typeof window !== 'undefined') {
                    message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
                }
            } else {
                if (typeof window !== 'undefined') {
                    message.error(error.response?.data?.message || 'Xác thực thất bại, vui lòng kiểm tra lại!');
                }
            }
            return Promise.reject(error);
        }

        // Các lỗi HTTP khác
        const errorData = error.response?.data;
        const errorMessage = errorData?.message || 'Không thể kết nối đến máy chủ!';

        if (typeof window !== 'undefined' && isDev && error.response?.status !== 401) {
            message.error(errorMessage);
        }

        console.error('❌ API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            response: errorData,
        });

        // Ưu tiên trả về errorData (có cấu trúc của ApiError) để UI dễ xử lý
        return Promise.reject(errorData || error);
    }
);

// =========================================================================
// 3. WRAPPER OBJECT: Đầu mối xuất khẩu API siêu Type-Safe
// Lợi ích: Bóc vỏ (unwrap) dữ liệu an toàn, không cần dùng 'any'
// =========================================================================
const customFetch = {
    get: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response = await axiosInstance.get<ApiResponse<T>>(url, config);
        // Dùng optional chaining (?.) để an toàn tuyệt đối với API Void (không có field data)
        return response.data?.data as T;
    },

    post: async <T = unknown>(url: string, payload?: unknown, config?: AxiosRequestConfig): Promise<T> => {
        const response = await axiosInstance.post<ApiResponse<T>>(url, payload, config);
        return response.data?.data as T;
    },

    put: async <T = unknown>(url: string, payload?: unknown, config?: AxiosRequestConfig): Promise<T> => {
        const response = await axiosInstance.put<ApiResponse<T>>(url, payload, config);
        return response.data?.data as T;
    },

    patch: async <T = unknown>(url: string, payload?: unknown, config?: AxiosRequestConfig): Promise<T> => {
        const response = await axiosInstance.patch<ApiResponse<T>>(url, payload, config);
        return response.data?.data as T;
    },

    delete: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response = await axiosInstance.delete<ApiResponse<T>>(url, config);
        return response.data?.data as T;
    },
};

export default customFetch;