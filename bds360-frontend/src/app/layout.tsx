// --- src/app/layout.tsx ---
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';


import { inter } from '@/config';
import './globals.css';
import { Providers } from './provider';

export const metadata: Metadata = {
  title: 'BDS 360',
  description: 'Nền tảng đăng tin bất động sản',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AntdRegistry>
          <Providers>

            {children}
          </Providers>
        </AntdRegistry>

      </body>
    </html>
  );
}