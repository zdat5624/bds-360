// @/features/auth/components/login.form.tsx
'use client';

import { APP_ROUTES } from '@/config/routes';
import { useLogin } from '@/features/auth/api/auth.mutations';
import { LoginFormValues, loginSchema } from '@/features/auth/auth.schema';
import { useAppTheme } from '@/hooks/use-app-theme';
import { FacebookFilled, GoogleOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Divider, Form, Input, Typography, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

const { Title, Text } = Typography;

export function LoginForm() {
    const {
        colorBgContainer, colorText, colorTextSecondary, colorTextTertiary,
        colorBorderSecondary, colorPrimary, borderRadius,
        colorGoogle, colorFacebook
    } = useAppTheme();

    const router = useRouter();

    // 1. Khởi tạo React Hook Form tích hợp Zod Schema
    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    // 2. Kéo Mutation Login từ React Query
    const { mutate: loginMutation, isPending } = useLogin();

    // 3. Xử lý Submit khi Form đã qua ải Validate của Zod
    const onSubmit = (values: LoginFormValues) => {
        loginMutation(values, {
            onSuccess: () => {
                message.success('Đăng nhập thành công!');
                // Điều hướng về Dashboard của User
                router.push(APP_ROUTES.USER.DASH_BOARD);
            },
            // Lỗi (nếu có) đã được file custom-fetch.ts hiển thị tự động, không cần try/catch ở đây!
        });
    };

    return (
        <div
            className="w-full max-w-[420px] p-8 shadow-2xl flex flex-col"
            style={{ background: colorBgContainer, borderRadius: borderRadius * 1.5 }}
        >
            {/* --- HEADER --- */}
            <div className="text-center mb-4">
                <Title level={2} style={{ color: colorText, margin: 0, marginBottom: 8, fontWeight: 700 }}>
                    BDS360
                </Title>
                <Text style={{ color: colorTextSecondary }}>
                    Bạn chưa có tài khoản?{' '}
                    <Link href={APP_ROUTES.AUTH.REGISTER} style={{ color: colorPrimary, fontWeight: 500 }}>
                        Đăng ký ngay
                    </Link>
                </Text>
            </div>

            {/* --- FORM --- 
                Dùng onFinish của Antd kết hợp với handleSubmit của RHF 
            */}
            <Form layout="vertical" size="large" onFinish={handleSubmit(onSubmit)}>
                <Form.Item
                    label={<span style={{ color: colorTextSecondary, fontWeight: 500 }}>Email</span>}
                    className="mb-5"
                    // Gắn trạng thái lỗi từ Zod vào Antd Form.Item
                    validateStatus={errors.username ? 'error' : ''}
                    help={errors.username?.message}
                >
                    {/* Bọc Input bằng Controller để RHF theo dõi dữ liệu */}
                    <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                prefix={<MailOutlined style={{ color: colorTextTertiary, marginRight: 8 }} />}
                                placeholder="user@bds360.com"
                                disabled={isPending} // Khóa Input khi đang gọi API
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label={<span style={{ color: colorTextSecondary, fontWeight: 500 }}>Mật khẩu</span>}
                    className="mb-2"
                    validateStatus={errors.password ? 'error' : ''}
                    help={errors.password?.message}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input.Password
                                {...field}
                                prefix={<LockOutlined style={{ color: colorTextTertiary, marginRight: 8 }} />}
                                placeholder="••••••••"
                                disabled={isPending} // Khóa Input khi đang gọi API
                            />
                        )}
                    />
                </Form.Item>

                <div className="flex justify-end mb-6">
                    <Link href={APP_ROUTES.AUTH.FORGOT_PASSWORD} style={{ color: colorPrimary, fontSize: 13, fontWeight: 500 }}>
                        Quên mật khẩu?
                    </Link>
                </div>

                <Form.Item className="mb-2">
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        style={{ fontWeight: 500 }}
                        className="h-11"
                        loading={isPending} // Tự động hiển thị vòng xoay xoay (Spinner) khi đang fetch API
                    >
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>

            {/* --- SOCIAL LOGIN --- */}
            <Divider style={{ color: colorTextTertiary, fontSize: 13, borderColor: colorBorderSecondary }} plain>
                hoặc kết nối với
            </Divider>

            <div className="flex gap-4">
                <Button
                    block
                    className="h-11"
                    icon={<GoogleOutlined style={{ color: colorGoogle }} />}
                    style={{ color: colorTextSecondary, fontWeight: 500 }}
                    disabled={isPending}
                >
                    Google
                </Button>
                <Button
                    block
                    className="h-11"
                    icon={<FacebookFilled style={{ color: colorFacebook }} />}
                    style={{ color: colorTextSecondary, fontWeight: 500 }}
                    disabled={isPending}
                >
                    Facebook
                </Button>
            </div>
        </div>
    );
}