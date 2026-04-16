// @/stores/auth.store.ts
import { User } from '@/types';
import { authStorage } from '@/utils/storage.util';
import { create } from 'zustand';

interface AuthState {
    // --- State ---
    user: User | null;
    isAuthenticated: boolean;
    /** * isInitialized dùng để cờ hiệu xem app đã kiểm tra token lần đầu xong chưa. 
     * Giúp ngăn chặn việc màn hình bị nháy (flicker) nội dung public trước khi load được thông tin user.
     */
    isInitialized: boolean;

    // --- Actions ---
    setAuth: (user: User, token: string) => void;
    setUser: (user: User) => void; // Dùng khi chỉ muốn update thông tin user (ví dụ: f5 lại trang gọi API getAccount)
    logout: () => void;
    setInitialized: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    // Initial State
    user: null,
    isAuthenticated: false,
    isInitialized: false,

    // Actions
    setAuth: (user, token) => {
        // 1. Lưu token vào localStorage thông qua tiện ích bạn đã viết
        authStorage.setToken(token);
        authStorage.setUserInfo(user);
        // 2. Cập nhật state
        set({ user, isAuthenticated: true });
    },

    setUser: (user) => {
        // Chỉ cập nhật thông tin user (thường gọi sau khi query useGetAccount thành công)
        authStorage.setUserInfo(user);
        set({ user, isAuthenticated: true });
    },

    logout: () => {
        // 1. Xóa token và user_info trong localStorage
        authStorage.clearAuth();
        // 2. Reset state về mặc định
        set({ user: null, isAuthenticated: false });
    },

    setInitialized: () => {
        set({ isInitialized: true });
    },
}));