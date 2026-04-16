// @/features/auth/components/register.form.tsx
'use client';

import { APP_ROUTES } from '@/config/routes';
import { GENDER_OPTIONS } from '@/constants/gender.constant';
import { useRegister } from '@/features/auth/api/auth.mutations';
import { RegisterFormValues, registerSchema } from '@/features/auth/auth.schema';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/stores/auth.store';
import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Divider, Form, Input, Select, Typography, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { GoogleAuthButton } from './google-auth.button';

const { Title, Text } = Typography;

export function RegisterForm() {
    const { colorBgContainer, colorText, colorTextSecondary, colorTextTertiary, colorBorderSecondary, colorPrimary, borderRadius } = useAppTheme();
    const router = useRouter();

    const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '', email: '', password: '', confirmPassword: '', phone: '', gender: 'MALE' as any
        },
    });

    const { mutate: registerMutation, isPending } = useRegister();

    const setAuth = useAuthStore((state) => state.setAuth);

    const onSubmit = (values: RegisterFormValues) => {
        // console.log('✅ Đã chạy vào onSubmit!', values);
        const { confirmPassword, ...payload } = values;
        registerMutation(payload, {
            onSuccess: (data) => {
                setAuth(data.user, data.accessToken);
                message.success('Đăng ký tài khoản thành công!');
                router.push(APP_ROUTES.USER.DASH_BOARD);
            }
        });
    };

    return (
        <div className="w-full max-w-[500px] p-8 shadow-2xl flex flex-col" style={{ background: colorBgContainer, borderRadius: borderRadius * 1.5 }}>
            <div className="text-center mb-2">
                <Title level={2} style={{ color: colorText, margin: 0, marginBottom: 8, fontWeight: 700 }}>Tạo tài khoản</Title>
                <Text style={{ color: colorTextSecondary }}>Đã có tài khoản? <Link href={APP_ROUTES.AUTH.LOGIN} style={{ color: colorPrimary, fontWeight: 500 }}>Đăng nhập</Link></Text>
            </div>

            {/* Thêm callback lỗi vào handleSubmit để dễ debug */}
            <Form layout="vertical" size="large" onFinish={handleSubmit(onSubmit, (err) => console.log('❌ Lỗi Validation:', err))}>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Form.Item className="flex-1 !mb-2 sm:!mb-4" label="Họ và tên" validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
                        <Controller name="name" control={control} render={({ field }) => (
                            <Input {...field} prefix={<UserOutlined style={{ color: colorTextTertiary }} />} placeholder="Nguyễn Văn A" disabled={isPending} />
                        )} />
                    </Form.Item>

                    {/* 1. TRƯỜNG EMAIL PHẢI CÓ Ở ĐÂY 👇 */}
                    <Form.Item className="flex-1 !mb-2 sm:!mb-4" label="Email" validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
                        <Controller name="email" control={control} render={({ field }) => (
                            <Input {...field} prefix={<MailOutlined style={{ color: colorTextTertiary }} />} placeholder="user@bds360.com" disabled={isPending} />
                        )} />
                    </Form.Item>
                </div>

                <div className="flex gap-4">
                    <Form.Item className="flex-1" label="Số điện thoại" validateStatus={errors.phone ? 'error' : ''} help={errors.phone?.message}>
                        <Controller name="phone" control={control} render={({ field }) => (
                            <Input {...field} prefix={<PhoneOutlined style={{ color: colorTextTertiary }} />} placeholder="0912..." disabled={isPending} />
                        )} />
                    </Form.Item>

                    <Form.Item className="flex-[0.6]" label="Giới tính">
                        <Controller name="gender" control={control} render={({ field }) => (
                            < Select {...field} disabled={isPending} options={GENDER_OPTIONS} />
                        )} />
                    </Form.Item>
                </div>


                <Form.Item className="flex-1" label="Mật khẩu" validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
                    <Controller name="password" control={control} render={({ field }) => (
                        <Input.Password {...field} prefix={<LockOutlined style={{ color: colorTextTertiary }} />} placeholder="••••••••" disabled={isPending} />
                    )} />
                </Form.Item>

                <Form.Item className="flex-1 !mb-6" label="Xác nhận" validateStatus={errors.confirmPassword ? 'error' : ''} help={errors.confirmPassword?.message}>
                    <Controller name="confirmPassword" control={control} render={({ field }) => (
                        <Input.Password {...field} prefix={<LockOutlined style={{ color: colorTextTertiary }} />} placeholder="••••••••" disabled={isPending} />
                    )} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block className="h-11" loading={isPending}>Đăng ký</Button>
                </Form.Item>
            </Form>

            <Divider style={{ color: colorTextTertiary, fontSize: 13, borderColor: colorBorderSecondary, marginTop: 0, marginBottom: 18 }} plain>hoặc</Divider>

            <div className="flex flex-col gap-3">
                <GoogleAuthButton />
            </div>
        </div>
    );
}