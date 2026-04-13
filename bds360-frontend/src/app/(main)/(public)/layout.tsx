// @/app/(main)/(public)/layout.tsx
'use client';

import { useAppTheme } from '@/hooks/use-app-theme';
import { Layout } from 'antd';
import { ReactNode } from 'react';

const { Content } = Layout;

export default function PublicLayout({ children }: { children: ReactNode }) {
    const { colorBgContainer } = useAppTheme();

    return (
        // Chỉ cung cấp background và bung 100% diện tích
        <Content
            style={{ background: colorBgContainer }}
            className="w-full flex-1 flex flex-col"
        >
            {children}
        </Content>
    );
}