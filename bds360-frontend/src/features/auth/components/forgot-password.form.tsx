// @/features/auth/components/forgot-password.form.tsx
'use client';

import { APP_ROUTES } from '@/config/routes';
import { useForgotPassword, useResetPassword } from '@/features/auth/api/auth.mutations';
import {
    ForgotPasswordFormValues,
    ResetPasswordFormValues,
    forgotPasswordSchema,
    resetPasswordSchema
} from '@/features/auth/auth.schema';
import { useAppTheme } from '@/hooks/use-app-theme';
import { ArrowLeftOutlined, LockOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, Typography, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const { Title, Text } = Typography;

export function ForgotPasswordForm() {
    const {
        colorBgContainer, colorText, colorTextSecondary, colorTextTertiary, colorPrimary, borderRadius
    } = useAppTheme();
    const router = useRouter();

    // Quản lý trạng thái bước hiện tại: 1 = Gửi Email, 2 = Nhập OTP & Đổi mật khẩu
    const [step, setStep] = useState<1 | 2>(1);
    const [sentEmail, setSentEmail] = useState<string>('');

    // --- Mutations ---
    const { mutate: forgotPasswordMutation, isPending: isSendingOTP } = useForgotPassword();
    const { mutate: resetPasswordMutation, isPending: isResetting } = useResetPassword();

    // --- Form 1: Xác nhận Email ---
    const form1 = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
    });

    // --- Form 2: Đặt lại mật khẩu ---
    const form2 = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { email: '', code: '', newPassword: '', confirmPassword: '' },
    });

    // --- Handlers ---
    const onSubmitStep1 = (values: ForgotPasswordFormValues) => {
        forgotPasswordMutation(values, {
            onSuccess: () => {
                message.success('Mã OTP đã được gửi đến email của bạn!');
                setSentEmail(values.email);
                // Truyền ngầm email sang form 2 để submit
                form2.setValue('email', values.email);
                setStep(2);
            }
        });
    };

    const onSubmitStep2 = (values: ResetPasswordFormValues) => {
        // Loại bỏ confirmPassword trước khi gửi xuống API
        const { confirmPassword, ...payload } = values;
        resetPasswordMutation(payload, {
            onSuccess: () => {
                message.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
                router.push(APP_ROUTES.AUTH.LOGIN);
            }
        });
    };

    const handleResendOTP = () => {
        if (!sentEmail) return;
        forgotPasswordMutation({ email: sentEmail }, {
            onSuccess: () => message.success('Đã gửi lại mã OTP!')
        });
    };

    return (
        <div
            className="w-full max-w-[500px] p-8 shadow-2xl flex flex-col transition-all duration-500"
            style={{ background: colorBgContainer, borderRadius: borderRadius * 1.5 }}
        >
            <div className="text-center mb-4">
                <Title level={2} style={{ color: colorText, margin: 0, marginBottom: 8, fontWeight: 700 }}>
                    {step === 1 ? 'Khôi phục mật khẩu' : 'Đặt lại mật khẩu'}
                </Title>
                <Text style={{ color: colorTextSecondary }}>
                    {step === 1
                        ? 'Nhập email của bạn, chúng tôi sẽ gửi mã OTP để xác nhận.'
                        : (
                            <span>
                                Mã xác nhận đã được gửi đến <strong style={{ color: colorText }}>{sentEmail}</strong>
                            </span>
                        )
                    }
                </Text>
            </div>

            {/* --- GIAO DIỆN BƯỚC 1 --- */}
            {step === 1 && (
                <Form layout="vertical" size="large" onFinish={form1.handleSubmit(onSubmitStep1)}>
                    <Form.Item
                        label="Email"
                        validateStatus={form1.formState.errors.email ? 'error' : ''}
                        help={form1.formState.errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={form1.control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    prefix={<MailOutlined style={{ color: colorTextTertiary }} />}
                                    placeholder="user@bds360.com"
                                    disabled={isSendingOTP}
                                />
                            )}
                        />
                    </Form.Item>

                    <Form.Item className="!mb-4 !mt-2">
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="h-11"
                            style={{ fontWeight: 600 }}
                            loading={isSendingOTP}
                        >
                            Gửi mã xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            )}

            {/* --- GIAO DIỆN BƯỚC 2 --- */}
            {step === 2 && (
                <Form layout="vertical" size="large" onFinish={form2.handleSubmit(onSubmitStep2)}>
                    <Form.Item
                        label="Mã OTP"
                        validateStatus={form2.formState.errors.code ? 'error' : ''}
                        help={form2.formState.errors.code?.message}
                    >
                        <Controller
                            name="code"
                            control={form2.control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    prefix={<SafetyCertificateOutlined style={{ color: colorTextTertiary }} />}
                                    placeholder="Nhập mã 6 chữ số"
                                    disabled={isResetting}
                                />
                            )}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu mới"
                        validateStatus={form2.formState.errors.newPassword ? 'error' : ''}
                        help={form2.formState.errors.newPassword?.message}
                    >
                        <Controller
                            name="newPassword"
                            control={form2.control}
                            render={({ field }) => (
                                <Input.Password
                                    {...field}
                                    prefix={<LockOutlined style={{ color: colorTextTertiary }} />}
                                    placeholder="••••••••"
                                    disabled={isResetting}
                                />
                            )}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Xác nhận mật khẩu mới"
                        validateStatus={form2.formState.errors.confirmPassword ? 'error' : ''}
                        help={form2.formState.errors.confirmPassword?.message}
                    >
                        <Controller
                            name="confirmPassword"
                            control={form2.control}
                            render={({ field }) => (
                                <Input.Password
                                    {...field}
                                    prefix={<LockOutlined style={{ color: colorTextTertiary }} />}
                                    placeholder="••••••••"
                                    disabled={isResetting}
                                />
                            )}
                        />
                    </Form.Item>

                    <div className="flex justify-end !mb-6" style={{ marginTop: -12 }}>
                        <Text style={{ fontSize: 13, color: colorTextSecondary }}>
                            Chưa nhận được mã?{' '}
                            <span
                                onClick={handleResendOTP}
                                style={{
                                    color: isSendingOTP ? colorTextTertiary : colorPrimary,
                                    cursor: isSendingOTP ? 'not-allowed' : 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                Gửi lại
                            </span>
                        </Text>
                    </div>

                    <Form.Item className="!mb-4">
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="h-11"
                            style={{ fontWeight: 600 }}
                            loading={isResetting}
                        >
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            )}

            {/* --- NÚT QUAY LẠI --- */}
            <div className="text-center mt-2">
                {step === 1 ? (
                    <Link
                        href={APP_ROUTES.AUTH.LOGIN}
                        style={{ color: colorTextSecondary, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                        <ArrowLeftOutlined /> Quay lại đăng nhập
                    </Link>
                ) : (
                    <span
                        onClick={() => setStep(1)}
                        style={{ color: colorTextSecondary, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                    >
                        <ArrowLeftOutlined /> Dùng email khác
                    </span>
                )}
            </div>
        </div>
    );
}