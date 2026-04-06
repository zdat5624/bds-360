// @/lib/custom-fetch.ts

import { envConfig } from '@/config';
import { ApiResponse } from '@/types';
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

// Interceptor: Xử lý Request (Thêm token nếu cần)
customFetch.interceptors.request.use(
    (config) => {
        // Ví dụ lấy token từ zustand store hoặc localStorage:
        // const token = useAuthStore.getState().token;
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor: Xử lý Response (The Envelope & Error Handling)
customFetch.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        const { code, message: msg, data } = response.data;

        // 1. Luồng Thành Công: Bóc vỏ và chỉ trả về Data (ExtractData<T>)
        if (code === SUCCESS_CODE) {
            return data; // Axios sẽ hiểu response bây giờ chính là phần 'data'
        }

        // 2. Luồng Lỗi Business (code !== 10000): Xử lý tập trung
        message.error(msg || 'Có lỗi nghiệp vụ xảy ra từ hệ thống!');

        // Ném lỗi ra để React Query (Mutation) bắt được (nếu cần xử lý thêm ở Component)
        return Promise.reject(response.data);
    },
    (error: AxiosError<ApiResponse>) => {
        // 3. Luồng Lỗi Hệ Thống (HTTP 400, 401, 403, 500)
        const errorData = error.response?.data;
        const errorMessage = errorData?.message || 'Không thể kết nối đến máy chủ!';

        // Xử lý tập trung hiển thị lỗi cho người dùng
        message.error(errorMessage);

        // Trả về errorData để form validation (Zod/RHF) có thể map các `validationErrors`
        return Promise.reject(errorData || error);
    }
);

export default customFetch;