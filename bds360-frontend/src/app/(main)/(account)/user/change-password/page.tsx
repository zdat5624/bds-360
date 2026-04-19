// @/app/(main)/(account)/user/change-password/page.tsx
'use client';
import { ChangePasswordForm } from '@/features/auth';
import {
    KeyOutlined
} from '@ant-design/icons';
import { Divider, Typography } from 'antd';

const { Title, Text } = Typography;

export default function ChangePasswordPage() {
    return (
        < >
            {/* --- HEADER TRANG --- */}
            <div>
                <Title level={3} className="!m-0 flex items-center gap-2">
                    <KeyOutlined />
                    Đổi mật khẩu
                </Title>
                <Text type="secondary">
                    Bảo vệ tài khoản của bạn bằng cách sử dụng mật khẩu mạnh và không dùng chung với các tài khoản khác.
                </Text>
            </div>

            <Divider className="!my-4" />

            {/* --- KHU VỰC FORM --- */}
            <div className="max-w-4xl">
                <ChangePasswordForm />
            </div>
        </>
    );
}