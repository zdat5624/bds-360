// @/components/composite/user-info.tsx
'use client';

import { APP_ROUTES } from '@/config/routes'; // 🌟 Import APP_ROUTES
import { TopUpButton } from '@/features/transactions/components/top-up.button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/stores';
import { formatCurrency } from '@/utils';
import { CheckCircleFilled, SwapOutlined, UserOutlined } from '@ant-design/icons'; // 🌟 Import CheckCircleFilled
import { Avatar, Skeleton, Tag, Tooltip } from 'antd'; // 🌟 Import Tag, Tooltip
import Link from 'next/link'; // 🌟 Import Link

export function UserInfo() {
    const {
        colorText, colorTextSecondary, colorBgLayout, colorBorderSecondary, colorPrimary, colorPrimaryBg
    } = useAppTheme();

    const user = useAuthStore((state) => state.user);
    const isInitialized = useAuthStore((state) => state.isInitialized);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // XỬ LÝ LOADING (Giữ nguyên)
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
                {/* 🌟 Thêm flex-1 để nội dung tự co giãn tránh bị tràn */}
                <div className="flex flex-col justify-center h-[48px] overflow-hidden flex-1">

                    {/* 🌟 Row chứa Tên + Trạng thái xác thực */}
                    <div className="flex items-center gap-1.5 w-full">
                        <span className="font-semibold text-[15px] truncate leading-[22px]">
                            {user.name}
                        </span>

                        {/* 🌟 Render Trạng thái Xác thực */}
                        {user.isVerified ? (
                            <Tooltip title="Tài khoản đã xác thực">
                                <CheckCircleFilled className="text-[14px] flex-shrink-0" style={{ color: colorPrimary }} />
                            </Tooltip>
                        ) : (
                            <Link href={APP_ROUTES.USER.PROFILE} className="flex-shrink-0 leading-none">
                                <Tooltip title="Nhấn để cập nhật hồ sơ và xác thực">
                                    <Tag
                                        color="warning"
                                        variant="filled"
                                        className=" !m-0 !text-[10px] !px-1 !py-[1px] cursor-pointer hover:!opacity-80 transition-opacity !font-medium"
                                    >
                                        Chưa X.T
                                    </Tag>
                                </Tooltip>
                            </Link>
                        )}
                    </div>

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