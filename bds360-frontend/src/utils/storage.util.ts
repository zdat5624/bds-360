// @/utils/storage.util.ts

export const storage = {
    getToken: () => {
        if (typeof window === 'undefined') return null; // Phòng lỗi Next.js SSR
        return localStorage.getItem('access_token');
    },

    setToken: (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', token);
        }
    },

    clearAuth: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_info');
        }
    },

    // Hàm lấy data chung an toàn không sợ lỗi JSON.parse
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
};