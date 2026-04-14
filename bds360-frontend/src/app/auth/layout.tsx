// @/app/auth/layout.tsx
'use client';

import { APP_ROUTES } from '@/config';
import { useAppTheme } from '@/hooks/use-app-theme';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
    // 1. Lấy token màu từ hệ thống để đảm bảo đồng bộ
    const { colorPrimary } = useAppTheme();

    return (
        <div
            // Layout chính: Chiếm trọn màn hình, căn giữa form và ẩn các phần thừa của hình trang trí
            className="relative min-h-screen w-full flex items-center justify-center p-2 sm:p-4 overflow-hidden"
            style={{ backgroundColor: colorPrimary }}
        >
            {/* --- HỆ THỐNG HÌNH KHỐI TRANG TRÍ (GEOMETRIC) ---
                Sử dụng đơn vị vw/vh để các vòng tròn tỷ lệ thuận với kích thước màn hình
            */}

            {/* Vòng tròn lớn góc dưới trái */}
            <div
                className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full pointer-events-none"
                style={{
                    background: 'linear-gradient(to top right, rgba(255,255,255,0.02), rgba(255,255,255,0.08))'
                }}
            />

            {/* Vòng tròn trung tâm lệch trái */}
            <div
                className="absolute top-[30%] -left-[15%] w-[40vw] h-[40vw] rounded-full pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom right, rgba(255,255,255,0.03), rgba(255,255,255,0.06))'
                }}
            />

            {/* Vòng tròn góc trên phải */}
            <div
                className="absolute -top-[15%] -right-[10%] w-[50vw] h-[50vw] rounded-full pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom left, rgba(0,0,0,0.02), rgba(0,0,0,0.05))'
                }}
            />

            <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
                <Link href={APP_ROUTES.PUBLIC.HOME}>
                    <Button
                        shape="round"
                        icon={<ArrowLeftOutlined style={{ fontSize: '12px' }} />}
                        title="Về trang chủ"
                        className="transition-transform hover:scale-105 active:scale-95"
                        // style={{ width: '48px', height: '48px' }}
                        style={{ padding: '0 12px', height: '36px' }}
                    >
                        Về trang chủ
                    </Button>
                </Link>
            </div>

            {/* --- NỘI DUNG FORM (LOGIN / REGISTER / FORGOT PASSWORD) ---
                Được bọc trong một lớp div có z-index cao để luôn nằm trên các hình trang trí
            */}
            <div className="relative z-10 w-full flex justify-center">
                {children}
            </div>
        </div>
    );
}