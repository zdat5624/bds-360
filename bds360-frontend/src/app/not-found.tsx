'use client';

import { APP_ROUTES } from '@/config';
import { useAppTheme } from '@/hooks/use-app-theme'; // Import hook của bạn
import { Button, Result } from 'antd';
import Link from 'next/link';
import React from 'react';

const NotFoundPage: React.FC = () => {
    // Lấy các token màu sắc từ hook
    const { colorBgLayout, colorTextSecondary, borderRadius, colorBgContainer } = useAppTheme();

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            // Dùng màu nền chuẩn của hệ thống thay vì màu trắng cứng
            backgroundColor: colorBgLayout,
            padding: '24px'
        }}>
            <div style={{
                backgroundColor: colorBgContainer,
                padding: '48px',
                borderRadius: borderRadius, // Bo góc đồng bộ với Card/Input trong app
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
                <Result
                    status="404"
                    title={<span style={{ fontWeight: 800 }}>404</span>}
                    subTitle={
                        <span style={{ color: colorTextSecondary }}>
                            Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị chuyển dời.
                        </span>
                    }
                    extra={
                        <Link href={APP_ROUTES.PUBLIC.HOME}>
                            <Button type="primary" size="large" shape="round">
                                Quay lại trang chủ
                            </Button>
                        </Link>
                    }
                />
            </div>
        </div>
    );
};

export default NotFoundPage;