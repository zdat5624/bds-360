// @/app/layout.tsx
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';

import { inter } from '@/config';
import '@/styles/antd-overrides.css';
import './globals.css';
import { Providers } from './provider';
export const metadata: Metadata = {
  title: 'BDS 360',
  description: 'Nền tảng đăng tin bất động sản',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AntdRegistry>
          <Providers>
            {/* Sử dụng MainLayout ở đây để tất cả các trang đều có Header/Footer */}
            {children}
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}