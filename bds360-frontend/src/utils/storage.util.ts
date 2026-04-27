// @/utils/storage.util.ts

import { User } from "@/types";

// 1. Lớp Core: Chỉ xử lý thao tác với LocalStorage chung
const coreStorage = {
    get: <T>(key: string): T | null => {
        if (typeof window === 'undefined') return null;

        const item = localStorage.getItem(key);
        if (!item) return null;

        try {
            // Cố gắng parse JSON (dành cho Object/Array như user_info)
            return JSON.parse(item);
        } catch {
            // FIX: Nếu lỗi parse JSON, chứng tỏ đây là chuỗi thuần (như access_token)
            // Trả về thẳng chuỗi đó ép kiểu sang T
            return item as unknown as T;
        }
    },
    set: <T>(key: string, value: T) => {
        if (typeof window !== 'undefined') {
            // Nếu là string thì lưu chuỗi thuần, ngược lại thì stringify
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        }
    },
    remove: (key: string) => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(key);
        }
    }
};

// 2. Lớp Domain: Bọc lại lớp Core để phục vụ riêng cho Auth
export const authStorage = {
    getToken: () => coreStorage.get<string>('access_token'),
    setToken: (token: string) => coreStorage.set('access_token', token),
    getUserInfo: () => coreStorage.get<User>('user_info'),
    setUserInfo: (userInfo: User) => coreStorage.set('user_info', userInfo),
    clearAuth: () => {
        coreStorage.remove('access_token');
        coreStorage.remove('user_info');
    },
};

export const storage = coreStorage;