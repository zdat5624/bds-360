// @/features/auth/components/reset-password.form.tsx
'use client';

import {
    ResetPasswordFormValues,
    useResetPassword
} from '@/features/auth'; // Import từ Barrel file của feature auth
import { Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';

export const ResetPasswordForm = () => {
    const router = useRouter();

    // Gọi hook ra để sử dụng
    const { mutate: resetPassword, isPending } = useResetPassword();

    // Hàm xử lý khi người dùng ấn Submit Form hợp lệ
    const onFinish = (values: ResetPasswordFormValues) => {

        // Gọi hàm mutate và truyền payload vào
        resetPassword(values, {
            onSuccess: () => {
                // Xử lý UI nội bộ khi thành công tại đây
                message.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');

                // Chuyển hướng người dùng về trang login
                router.push('/login');
            },

        });
    };

    return (
        <Form
            layout="vertical"
            onFinish={onFinish}
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
            >
                <Input placeholder="Nhập email của bạn" />
            </Form.Item>

            <Form.Item
                label="Mã xác nhận (Code)"
                name="code"
                rules={[{ required: true, message: 'Vui lòng nhập mã!' }]}
            >
                <Input placeholder="Nhập mã xác nhận từ email" />
            </Form.Item>

            <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
            >
                <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>

            <Form.Item>
                {/* Dùng isPending để làm nút loading tự động */}
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={isPending}
                    block
                >
                    Xác nhận đổi mật khẩu
                </Button>
            </Form.Item>
        </Form>
    );
};