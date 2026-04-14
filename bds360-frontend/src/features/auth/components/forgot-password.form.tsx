// @/features/auth/components/forgot-password.form.tsx
'use client';

import { APP_ROUTES } from '@/config/routes';
import { useAppTheme } from '@/hooks/use-app-theme';
import { ArrowLeftOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import Link from 'next/link';

const { Title, Text } = Typography;

export function ForgotPasswordForm() {
    const {
        colorBgContainer, colorText, colorTextSecondary, colorTextTertiary, borderRadius
    } = useAppTheme();

    return (
        <div
            className="w-full max-w-[420px] p-8 shadow-2xl flex flex-col"
            style={{ background: colorBgContainer, borderRadius: borderRadius * 1.5 }}
        >
            <div className="text-center mb-4">
                <Title level={2} style={{ color: colorText, margin: 0, marginBottom: 8, fontWeight: 700 }}>
                    Khôi phục mật khẩu
                </Title>
                <Text style={{ color: colorTextSecondary }}>
                    Nhập email của bạn, chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
                </Text>
            </div>

            <Form layout="vertical" size="large">
                <Form.Item
                    label={<span style={{ color: colorTextSecondary, fontWeight: 500 }}>Email</span>}
                    name="email"
                    className="mb-6" // 👈 Giãn khoảng cách với nút bấm
                >
                    <Input prefix={<MailOutlined style={{ color: colorTextTertiary, marginRight: 8 }} />} placeholder="user@bds360.com" />
                </Form.Item>

                <Form.Item className="mb-2">
                    <Button type="primary" htmlType="submit" block style={{ fontWeight: 500 }} className="h-11">
                        Gửi liên kết khôi phục
                    </Button>
                </Form.Item>
            </Form>

            {/* Đẩy link quay lại đăng nhập xuống dưới một chút */}
            <div className="text-center mt-6">
                <Link href={APP_ROUTES.AUTH.LOGIN} style={{ color: colorTextSecondary, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <ArrowLeftOutlined /> Quay lại đăng nhập
                </Link>
            </div>
        </div>
    );
}