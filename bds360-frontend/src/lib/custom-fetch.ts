import { message } from 'antd';
import Axios, {
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig
} from 'axios';

// 0. Utility Type để tự động "móc" dữ liệu từ các Interface phẳng mà Orval gen
// Nếu T có trường data, lấy kiểu của data. Nếu không, lấy chính T.
type ExtractData<T> = T extends { data?: infer U } ? U : T;

export const AXIOS_INSTANCE = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    timeout: 10000,
});

// 1. REQUEST INTERCEPTOR
AXIOS_INSTANCE.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR
AXIOS_INSTANCE.interceptors.response.use(
    (response: AxiosResponse) => {
        const backendData = response.data;

        // Kiểm tra Business Code từ Backend (ví dụ 10000 là thành công)
        if (backendData.code !== undefined && backendData.code !== 10000) {
            message.error(backendData.message || 'Có lỗi nghiệp vụ xảy ra');
            return Promise.reject(backendData);
        }

        return response;
    },
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            localStorage.removeItem('accessToken');
            message.error('Phiên đăng nhập hết hạn');
            if (typeof window !== 'undefined') window.location.href = '/login';
        } else if (status === 403) {
            message.error('Bạn không có quyền thực hiện hành động này');
        } else if (!status) {
            message.error('Không thể kết nối đến máy chủ!');
        }

        return Promise.reject(error.response?.data || error);
    }
);

// 3. HÀM CUSTOM FETCH (Đã fix để bóc vỏ dữ liệu)
export const customFetch = async <T>(config: AxiosRequestConfig): Promise<ExtractData<T>> => {
    const response = await AXIOS_INSTANCE(config);

    // TRẢ VỀ PHẦN RUỘT: .data.data
    // TypeScript nhờ ExtractData<T> sẽ tự hiểu đây là UserResponse hoặc PostResponse...
    return response.data.data;
};