// @/providers/auth.provider.tsx
'use client';

import { useGetAccount } from '@/features/auth/api/auth.queries';
import { useAuthStore } from '@/stores/auth.store';
import { authStorage } from '@/utils/storage.util';
import { ReactNode, useEffect } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
    // Kéo các action và state từ Zustand
    const setAuth = useAuthStore((state) => state.setAuth);
    const setUser = useAuthStore((state) => state.setUser);
    const setInitialized = useAuthStore((state) => state.setInitialized);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // 1. KHỞI TẠO NHANH TỪ LOCALSTORAGE (Tránh delay UI)
    useEffect(() => {
        const token = authStorage.getToken();
        const user = authStorage.getUserInfo();

        if (token && user) {
            // Đẩy data cũ vào store để UI hiển thị ngay lập tức (không chớp màn hình)
            setAuth(user, token);
        }

        // Bật cờ báo hiệu đã check xong storage (cho phép app render nội dung)
        setInitialized();
    }, [setAuth, setInitialized]);

    // 2. GỌI API LẤY THÔNG TIN MỚI NHẤT TRONG BACKGROUND
    // Hook này chỉ được "kích hoạt" (enabled) khi app xác định là đã đăng nhập 
    // (tức là sau khi useEffect phía trên setAuth thành công).
    const { data: freshUser, isSuccess } = useGetAccount(isAuthenticated);

    // 3. CẬP NHẬT LẠI STATE KHI CÓ DATA MỚI TỪ API
    useEffect(() => {
        if (isSuccess && freshUser) {
            // Hàm setUser của bạn đã có sẵn logic lưu vào authStorage bên trong store
            setUser(freshUser);
        }
    }, [isSuccess, freshUser, setUser]);

    return <>{children}</>;
}