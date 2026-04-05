// --- src/app/layout.tsx ---
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import type { Metadata } from 'next';


import '@/app/globals.css';
import { antdTheme, inter } from '@/config';
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
        <Providers>
          <AntdRegistry>
            <ConfigProvider theme={antdTheme}>
              {children}
            </ConfigProvider>
          </AntdRegistry>
        </Providers>
      </body>
    </html>
  );
}