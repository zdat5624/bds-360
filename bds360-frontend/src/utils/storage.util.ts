// @/utils/storage.util.ts

// 1. Lớp Core: Chỉ xử lý thao tác với LocalStorage chung
const coreStorage = {
    get: <T>(key: string): T | null => {
        if (typeof window === 'undefined') return null;
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return null;
        }
    },
    set: (key: string, value: any) => {
        if (typeof window !== 'undefined') {
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
    clearAuth: () => {
        coreStorage.remove('access_token');
        coreStorage.remove('user_info');
    },
};

// Export chung nếu cần dùng các hàm generic khác
export const storage = coreStorage;