// File: @/app/(main)/layout.tsx
'use client';

import { Header } from '@/components/layouts/header';
import { FloatingNotificationButton } from '@/features/notifications';
import { Layout } from 'antd';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
    // Đã xóa toàn bộ Zustand state và logic isMapView ở đây
    return (
        <Layout
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Header />

            {/* Nội dung sẽ được các Layout con tự quyết định (Có Footer hay không) */}
            {children}

            <FloatingNotificationButton />
        </Layout>
    );
}