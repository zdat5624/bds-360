// @/app/(main)/layout.tsx
'use client';
import { Footer } from '@/components/layouts/footer';
import { Header } from '@/components/layouts/header';
import { Layout } from 'antd';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            {/* Nội dung của (public) hoặc (account) sẽ chui vào đây */}
            {children}
            <Footer />
        </Layout>
    );
}