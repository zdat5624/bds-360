// @/lib/custom-fetch.ts

import { APP_ROUTES, envConfig } from '@/config';
import { ApiResponse } from '@/types';
import { authStorage } from '@/utils'; // 👈 Import authStorage từ file index của utils
import { message } from 'antd';
import axios, { AxiosError, AxiosResponse } from 'axios';

// Hằng số mapping từ Backend
const SUCCESS_CODE = 10000;

const customFetch = axios.create({
    baseURL: envConfig.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// =========================================================================
// 1. INTERCEPTOR REQUEST: Tự động đính kèm Token vào mọi API gửi đi
// =========================================================================
customFetch.interceptors.request.use(
    (config) => {
        // Lấy token an toàn qua authStorage (đã check SSR bên trong)
        const token = authStorage.getToken();

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// =========================================================================
// 2. INTERCEPTOR RESPONSE: Xử lý bóc tách dữ liệu và Bắt lỗi tập trung
// =========================================================================
customFetch.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        const { code, message: msg, data } = response.data;

        // [A] Luồng Thành Công: Bóc vỏ Envelope và chỉ trả về Data lõi
        if (code === SUCCESS_CODE) {
            return data;
        }

        // [B] Luồng Lỗi Business (code !== 10000)
        if (typeof window !== 'undefined') {
            message.error(msg || 'Có lỗi nghiệp vụ xảy ra từ hệ thống!');

        }
        return Promise.reject(response.data);
    },
    (error: AxiosError<ApiResponse>) => {
        // [C] Luồng Lỗi Hệ Thống (HTTP 400, 401, 403, 500)

        // C1: Xử lý đặc thù cho lỗi 401 (Hết hạn Token hoặc Token không hợp lệ)
        if (error.response?.status === 401) {

            // Xóa sạch dấu vết trong LocalStorage
            authStorage.clearAuth();

            // Điều hướng về trang login (Chỉ chạy trên Client, an toàn với SSR)
            if (typeof window !== 'undefined') {
                message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
                window.location.href = APP_ROUTES.AUTH.LOGIN; // Điều hướng về trang login sau khi logout sạch sẽ
            }

            return Promise.reject(error);
        }

        // C2: Các lỗi hệ thống khác
        const errorData = error.response?.data;
        const errorMessage = errorData?.message || 'Không thể kết nối đến máy chủ!';
        if (typeof window !== 'undefined') {
            message.error(errorMessage);

        }

        // Trả về errorData để Zod/RHF có thể map hiển thị lỗi trực tiếp trên Form
        return Promise.reject(errorData || error);
    }
);

export default customFetch;