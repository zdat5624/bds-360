// @/app/auth/layout.tsx
'use client';

import { APP_ROUTES } from '@/config';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/stores/auth.store'; // 👈 Import store chứa trạng thái đăng nhập
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 👈 Import useRouter
import { ReactNode, useEffect } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
    const { colorPrimary } = useAppTheme();
    const router = useRouter();

    // 👈 Lấy trạng thái từ store (điều chỉnh tên state cho khớp với store của bạn nếu cần)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isInitialized = useAuthStore((state) => state.isInitialized);

    // 👈 Logic kiểm tra: Nếu đã đăng nhập thì đá văng về trang chủ
    useEffect(() => {
        if (isAuthenticated) {
            router.push(APP_ROUTES.PUBLIC.HOME || '/');
        }
    }, [isAuthenticated, router]);

    // 👈 (Tùy chọn) Chặn không cho render giao diện Login/Register trong lúc chờ chuyển hướng
    // Tránh việc màn hình nháy lên form đăng nhập một tích tắc rồi mới chuyển
    if (isAuthenticated) {
        return null; // Hoặc bạn có thể return một cái <Spin /> loading của Antd
    }

    // Đợi Zustand load xong từ LocalStorage rồi mới render nội dung để tránh hydratation error
    if (!isInitialized) {
        return null;
    }

    return (
        <div
            // justify-start trên mobile để cuộn trang tự nhiên, justify-center trên sm+
            className="relative min-h-screen w-full flex flex-col sm:flex-row items-center justify-start sm:justify-center p-4 overflow-x-hidden"
            style={{ backgroundColor: colorPrimary }}
        >
            {/* --- HỆ THỐNG HÌNH KHỐI TRANG TRÍ (Giữ nguyên) --- */}
            <div
                className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full pointer-events-none"
                style={{ background: 'linear-gradient(to top right, rgba(255,255,255,0.02), rgba(255,255,255,0.08))' }}
            />
            <div
                className="absolute top-[30%] -left-[15%] w-[40vw] h-[40vw] rounded-full pointer-events-none"
                style={{ background: 'linear-gradient(to bottom right, rgba(255,255,255,0.03), rgba(255,255,255,0.06))' }}
            />
            <div
                className="absolute -top-[15%] -right-[10%] w-[50vw] h-[50vw] rounded-full pointer-events-none"
                style={{ background: 'linear-gradient(to bottom left, rgba(0,0,0,0.02), rgba(0,0,0,0.05))' }}
            />

            {/* --- NÚT VỀ TRANG CHỦ --- */}
            <div className="absolute top-4 left-0 right-0 z-20 flex justify-center lg:left-8 lg:right-auto lg:top-8 lg:justify-start">
                <Link href={APP_ROUTES.PUBLIC.HOME}>
                    <Button
                        shape="round"
                        icon={<ArrowLeftOutlined style={{ fontSize: '12px' }} />}
                        className="transition-transform hover:scale-105 active:scale-95 flex items-center"
                        style={{ padding: '0 12px', height: '36px' }}
                    >
                        <span className="inline ml-1 font-medium">Về trang chủ</span>
                    </Button>
                </Link>
            </div>

            {/* --- NỘI DUNG FORM --- */}
            <div
                className="relative z-10 w-full flex justify-center py-12 lg:py-0"
            >
                {children}
            </div>
        </div>
    );
}