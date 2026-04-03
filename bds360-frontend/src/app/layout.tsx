import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd'; // Thêm ConfigProvider để đổi Theme toàn cục
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BDS 360",
  description: "Nền tảng giao dịch bất động sản",
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
            <ConfigProvider theme={{ token: { colorPrimary: '#2563eb' } }}>
              {children}
            </ConfigProvider>
          </AntdRegistry>
        </Providers>
      </body>
    </html>
  );
}