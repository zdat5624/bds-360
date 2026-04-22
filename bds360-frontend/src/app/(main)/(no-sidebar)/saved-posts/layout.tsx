// @/app/(main)/(account)/user/layout.tsx
'use client';

import { Footer } from '@/components/layouts';
import { Layout } from 'antd';
import { ReactNode } from 'react';

const { Sider, Content } = Layout;

export default function NoSidebarLayout({ children }: { children: ReactNode }) {


    return (
        <Layout>
            {children}
            <Footer />
        </Layout>
    );
}