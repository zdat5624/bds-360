// File: @/app/(main)/(public)/layout.tsx
'use client';

import { Footer } from '@/components/layouts/footer';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Layout } from 'antd';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const { Content } = Layout;

export default function PublicLayout({ children }: { children: ReactNode }) {
    const { colorBgContainer } = useAppTheme();
    const pathname = usePathname();

    //  Kiểm tra xem có đang ở trong group (listings) hay không
    const isListingsGroup = pathname.startsWith('/rent') || pathname.startsWith('/sale');

    return (
        <Content
            style={{ background: colorBgContainer }}
            //  CHỈ CẦN 'w-full flex-1 flex flex-col' LÀ ĐỦ
            // Không ép 'h-screen' hay 'h-full' ở đây
            className="w-full flex-1 flex flex-col"
        >
            {children}

            {/*  NẾU LÀ TRANG CHỦ HOẶC CÁC TRANG BÌNH THƯỜNG -> VẼ FOOTER */}
            {/* NẾU LÀ NHÓM RENT/SALE -> KHÔNG VẼ FOOTER (Nhường cho group listings tự lo) */}
            {!isListingsGroup && <Footer />}
        </Content>
    );
}