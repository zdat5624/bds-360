// @/features/auth/components/login.form.tsx
'use client';

import { APP_ROUTES } from '@/config/routes';
import { LoginFormValues, loginSchema, useLoginMutation } from '@/features/auth';
import { useAppTheme } from '@/hooks';
import { useAuthStore } from '@/stores';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Divider, Form, Input, Typography, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { GoogleAuthButton } from './google-auth.button';

const { Title, Text } = Typography;

export function LoginForm() {
    const {
        colorBgContainer, colorText, colorTextSecondary, colorTextTertiary,
        colorBorderSecondary, colorPrimary, borderRadius
    } = useAppTheme();

    const router = useRouter();

    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const { mutate: loginMutation, isPending } = useLoginMutation();

    const setAuth = useAuthStore((state) => state.setAuth);

    const onSubmit = (values: LoginFormValues) => {
        loginMutation(values, {
            onSuccess: async (data) => {
                setAuth(data.user, data.accessToken);
                message.success('Đăng nhập thành công!');

                await new Promise((resolve) => setTimeout(resolve, 5000));
                router.push(APP_ROUTES.USER.DASH_BOARD);
            },
        });
    };

    return (
        <div
            className="w-full max-w-[500px] p-8 shadow-2xl flex flex-col"
            style={{ background: colorBgContainer, borderRadius: borderRadius * 1.5 }}
        >
            <div className="text-center mb-2">
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

            {/* Bổ sung callback lỗi để đồng bộ debug với Register */}
            <Form
                layout="vertical"
                size="large"
                onFinish={handleSubmit(onSubmit, (err) => console.log('❌ Lỗi Validation:', err))}
            >
                <Form.Item
                    label="Email"
                    validateStatus={errors.username ? 'error' : ''}
                    help={errors.username?.message}
                >
                    <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                prefix={<MailOutlined style={{ color: colorTextTertiary }} />}
                                placeholder="user@bds360.com"
                                disabled={isPending}
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    validateStatus={errors.password ? 'error' : ''}
                    help={errors.password?.message}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input.Password
                                {...field}
                                prefix={<LockOutlined style={{ color: colorTextTertiary }} />}
                                placeholder="••••••••"
                                disabled={isPending}
                            />
                        )}
                    />
                </Form.Item>

                <div className="flex justify-end !mb-6" style={{ marginTop: -12 }}>
                    <Link
                        href={APP_ROUTES.AUTH.FORGOT_PASSWORD}
                        style={{ color: colorPrimary, fontSize: 13, fontWeight: 500 }}
                    >
                        Quên mật khẩu?
                    </Link>
                </div>

                <Form.Item >
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        style={{ fontWeight: 600 }}
                        className="h-11"
                        loading={isPending}
                    >
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>

            {/* Cập nhật Optical Spacing chuẩn theo file Register */}
            <Divider
                style={{
                    color: colorTextTertiary,
                    fontSize: 13,
                    borderColor: colorBorderSecondary,
                    marginTop: 0,
                    marginBottom: 18
                }}
                plain
            >
                hoặc
            </Divider>

            <div className="flex flex-col gap-3">
                <GoogleAuthButton />
            </div>
        </div>
    );
}