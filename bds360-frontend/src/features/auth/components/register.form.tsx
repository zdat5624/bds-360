// @/features/auth/components/register.form.tsx
'use client';

import { APP_ROUTES } from '@/config/routes';
import { useAppTheme } from '@/hooks/use-app-theme';
import { FacebookFilled, GoogleOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Select, Typography } from 'antd';
import Link from 'next/link';

const { Title, Text } = Typography;

export function RegisterForm() {
    const {
        colorBgContainer, colorText, colorTextSecondary, colorTextTertiary,
        colorBorderSecondary, colorPrimary, borderRadius,
        colorGoogle, colorFacebook
    } = useAppTheme();

    return (
        <div
            className="w-full max-w-[420px] p-8 shadow-2xl flex flex-col"
            style={{ background: colorBgContainer, borderRadius: borderRadius * 1.5 }}
        >
            <div className="text-center mb-4">
                <Title level={2} style={{ color: colorText, margin: 0, marginBottom: 8, fontWeight: 700 }}>
                    Tạo tài khoản
                </Title>
                <Text style={{ color: colorTextSecondary }}>
                    Đã có tài khoản?{' '}
                    <Link href={APP_ROUTES.AUTH.LOGIN} style={{ color: colorPrimary, fontWeight: 500 }}>
                        Đăng nhập
                    </Link>
                </Text>
            </div>

            <Form layout="vertical" size="large">
                <Form.Item
                    label={<span style={{ color: colorTextSecondary, fontWeight: 500 }}>Họ và tên</span>}
                    name="name"
                    className="mb-5" // 👈 Thêm mb-5
                >
                    <Input prefix={<UserOutlined style={{ color: colorTextTertiary, marginRight: 8 }} />} placeholder="Nguyễn Văn A" />
                </Form.Item>

                <Form.Item
                    label={<span style={{ color: colorTextSecondary, fontWeight: 500 }}>Email</span>}
                    name="email"
                    className="mb-5" // 👈 Thêm mb-5
                >
                    <Input prefix={<MailOutlined style={{ color: colorTextTertiary, marginRight: 8 }} />} placeholder="user@bds360.com" />
                </Form.Item>

                {/* Bọc 2 field này trong flex và margin-bottom để chúng không bị sát nhau */}
                <div className="flex gap-4 mb-5">
                    <Form.Item
                        className="flex-1 mb-0"
                        label={<span style={{ color: colorTextSecondary, fontWeight: 500 }}>Số điện thoại</span>}
                        name="phone"
                    >
                        <Input prefix={<PhoneOutlined style={{ color: colorTextTertiary, marginRight: 8 }} />} placeholder="0912..." />
                    </Form.Item>

                    <Form.Item
                        className="flex-[0.6] mb-0"
                        label={<span style={{ color: colorTextSecondary, fontWeight: 500 }}>Giới tính</span>}
                        name="gender"
                    >
                        <Select placeholder="Chọn">
                            <Select.Option value="MALE">Nam</Select.Option>
                            <Select.Option value="FEMALE">Nữ</Select.Option>
                            <Select.Option value="OTHER">Khác</Select.Option>
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item
                    label={<span style={{ color: colorTextSecondary, fontWeight: 500 }}>Mật khẩu</span>}
                    name="password"
                    className="mb-6" // Thêm margin bự hơn một chút sát nút bấm
                >
                    <Input.Password prefix={<LockOutlined style={{ color: colorTextTertiary, marginRight: 8 }} />} placeholder="••••••••" />
                </Form.Item>

                <Form.Item className="mb-2">
                    <Button type="primary" htmlType="submit" block style={{ fontWeight: 500 }} className="h-11">
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form>

            <Divider style={{ color: colorTextTertiary, fontSize: 13, borderColor: colorBorderSecondary }} plain>
                hoặc kết nối với
            </Divider>

            <div className="flex gap-4">
                <Button
                    block
                    className="h-11"
                    icon={<GoogleOutlined style={{ color: colorGoogle }} />} // 👈 Đã sửa thành Token
                    style={{ color: colorTextSecondary, fontWeight: 500 }}
                >
                    Google
                </Button>
                <Button
                    block
                    className="h-11"
                    icon={<FacebookFilled style={{ color: colorFacebook }} />} // 👈 Đã sửa thành Token
                    style={{ color: colorTextSecondary, fontWeight: 500 }}
                >
                    Facebook
                </Button>
            </div>
        </div>
    );
}