// @/features/users/components/user-info.tsx
'use client';

import { useAppTheme } from '@/hooks/use-app-theme';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Skeleton } from 'antd';

export function UserInfo() {
    const {
        colorText, colorTextSecondary, colorBgLayout, colorBorderSecondary, colorPrimary, colorPrimaryBg
    } = useAppTheme();

    const user = { name: 'Nguyễn Văn A', email: 'vana@gmail.com', balance: 5000000 };
    const isLoading = false;

    if (isLoading) return <Skeleton.Avatar active size="large" className="m-5" />;

    return (
        <div className="flex flex-col gap-5 pb-4">

            <div className="flex items-center gap-3">
                <Avatar
                    size={48}
                    icon={<UserOutlined />}
                    style={{ background: colorPrimaryBg, color: colorPrimary, borderColor: colorPrimaryBg }}
                />
                <div className="flex flex-col justify-center h-[48px] overflow-hidden">
                    <span className="font-semibold text-[15px] truncate leading-tight">
                        {user.name}
                    </span>
                    <span className="text-[13px] truncate leading-tight">
                        {user.email}
                    </span>
                </div>
            </div>

            <div
                className="p-3.5 rounded-xl border shadow-sm flex flex-col gap-1.5"
                style={{ background: colorBgLayout, borderColor: colorBorderSecondary }}
            >
                <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium uppercase tracking-wider" style={{ color: colorTextSecondary }}>
                        Số dư hiện tại
                    </span>
                    <Button type="primary" shape="round" icon={<PlusOutlined />} className="shadow-none text-[12px] h-6 px-2.5">
                        Nạp
                    </Button>
                </div>

                <div className="text-[17px] font-bold tracking-tight" style={{ color: colorText }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user.balance)}
                </div>
            </div>

        </div>
    );
}