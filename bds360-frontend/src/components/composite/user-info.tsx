// @/components/composite/user-info.tsx
'use client';

import { TopUpButton } from '@/features/transactions/components/top-up.button'; // 👇 Import TopUpButton
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/stores';
import { formatCurrency } from '@/utils';
import { SwapOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Skeleton } from 'antd';

export function UserInfo() {
    const {
        colorText, colorTextSecondary, colorBgLayout, colorBorderSecondary, colorPrimary, colorPrimaryBg
    } = useAppTheme();

    const user = useAuthStore((state) => state.user);
    const isInitialized = useAuthStore((state) => state.isInitialized);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // XỬ LÝ LOADING (Giữ nguyên "thuốc chữa" của ông)
    if (!isInitialized) {
        return (
            <div className="flex flex-col gap-5 pb-6">
                <div className="flex items-center gap-3">
                    <Skeleton.Avatar active size={48} />
                    <div className="flex flex-col justify-center gap-1 w-full h-[48px]">
                        <Skeleton.Button active style={{ display: 'block', width: '70%', height: 16, minWidth: 0 }} size="small" />
                        <Skeleton.Button active style={{ display: 'block', width: '40%', height: 14, minWidth: 0 }} size="small" />
                    </div>
                </div>

                <div
                    className="p-3.5 rounded-xl border shadow-sm flex flex-col gap-1.5"
                    style={{ background: colorBgLayout, borderColor: colorBorderSecondary }}
                >
                    <div className="flex justify-between items-center h-[24px]">
                        <Skeleton.Button active style={{ display: 'block', width: 90, height: 14, minWidth: 0 }} size="small" />
                        <Skeleton.Button active shape="round" style={{ display: 'block', width: 54, height: 24, minWidth: 0 }} size="small" />
                    </div>
                    <div className="flex items-center h-[26px]">
                        <Skeleton.Button active style={{ display: 'block', width: 130, height: 20, minWidth: 0 }} size="small" />
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user) return null;

    return (
        <div className="flex flex-col gap-5 pb-4">
            <div className="flex items-center gap-3">
                <Avatar
                    size={48}
                    src={user.avatar}
                    icon={!user.avatar && <UserOutlined />}
                    style={{ background: colorPrimaryBg, color: colorPrimary, borderColor: colorPrimaryBg }}
                />
                <div className="flex flex-col justify-center h-[48px] overflow-hidden">
                    <span className="font-semibold text-[15px] truncate leading-[22px]">
                        {user.name}
                    </span>
                    <span className="text-[13px] truncate leading-[20px]" style={{ color: colorTextSecondary }}>
                        {user.email}
                    </span>
                </div>
            </div>

            <div
                className="p-3.5 rounded-md border shadow-sm flex flex-col gap-1.5"
                style={{ background: colorBgLayout, borderColor: colorBorderSecondary }}
            >
                <div className="flex justify-between items-center h-[24px]">
                    <span className="text-[12px] font-medium uppercase tracking-wider leading-none" style={{ color: colorTextSecondary }}>
                        Số dư hiện tại
                    </span>
                    {/* 👇 Sử dụng TopUpButton thay vì Button thuần của Antd */}
                    <TopUpButton
                        type="primary"
                        shape="default"
                        icon={<SwapOutlined />}
                        className="shadow-none text-[12px] h-6 px-2.5"
                    >
                        Nạp
                    </TopUpButton>
                </div>

                <div className="text-[17px] font-bold tracking-tight h-[26px] flex items-center" style={{ color: colorText }}>
                    {formatCurrency(user.balance)}
                </div>
            </div>
        </div>
    );
}