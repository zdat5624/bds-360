// @/features/auth/components/change-password.form.tsx
'use client';

import { useChangePassword } from '@/features/auth/api/auth.mutations';
import { ChangePasswordFormValues, changePasswordSchema } from '@/features/auth/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, message } from 'antd';
import { Controller, useForm } from 'react-hook-form';

export function ChangePasswordForm() {
    const { mutate: changePassword, isPending } = useChangePassword();

    const { control, handleSubmit, reset } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (values: ChangePasswordFormValues) => {
        // Chỉ gửi currentPassword và newPassword xuống API (Bỏ confirmPassword)
        changePassword(
            {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            },
            {
                onSuccess: () => {
                    message.success('Đổi mật khẩu thành công!');
                    reset(); // Xóa sạch form sau khi đổi thành công
                },
            }
        );
    };

    return (
        // Giới hạn max-w-md (khoảng 448px) vì form mật khẩu không nên kéo dài bè ra màn hình
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="w-full max-w-md">
            <Controller
                name="currentPassword"
                control={control}
                render={({ field, fieldState }) => (
                    <Form.Item
                        label="Mật khẩu hiện tại"
                        required
                        validateStatus={fieldState.invalid ? 'error' : ''}
                        help={fieldState.error?.message}
                    >
                        <Input.Password {...field} placeholder="Nhập mật khẩu hiện tại..." disabled={isPending} />
                    </Form.Item>
                )}
            />

            <Controller
                name="newPassword"
                control={control}
                render={({ field, fieldState }) => (
                    <Form.Item
                        label="Mật khẩu mới"
                        required
                        validateStatus={fieldState.invalid ? 'error' : ''}
                        help={fieldState.error?.message}
                    >
                        <Input.Password {...field} placeholder="Nhập mật khẩu mới..." disabled={isPending} />
                    </Form.Item>
                )}
            />

            <Controller
                name="confirmPassword"
                control={control}
                render={({ field, fieldState }) => (
                    <Form.Item
                        label="Xác nhận mật khẩu mới"
                        required
                        validateStatus={fieldState.invalid ? 'error' : ''}
                        help={fieldState.error?.message}
                        className="mb-8" // Margin quang học chuẩn SAAS trước nút bấm
                    >
                        <Input.Password {...field} placeholder="Nhập lại mật khẩu mới..." disabled={isPending} />
                    </Form.Item>
                )}
            />

            <div className="flex justify-start">
                <Button type="primary" htmlType="submit" loading={isPending}>
                    Đổi mật khẩu
                </Button>
            </div>
        </Form>
    );
}