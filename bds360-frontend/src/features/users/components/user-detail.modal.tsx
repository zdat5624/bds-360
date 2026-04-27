// @/features/users/components/user-detail.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { GENDER_LABEL, USER_ROLE_COLOR, USER_ROLE_LABEL } from '@/constants';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatCurrency, formatDateTime } from '@/utils';
import { CheckCircleFilled, CloseCircleFilled, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Descriptions, Flex, Skeleton, Tag, Typography } from 'antd';
import { useState } from 'react';
import { useGetLatestVerification, useGetUserById } from '../api/user.queries';
import { VerificationReviewModal } from './verification-review.modal';

const { Text } = Typography;

interface UserDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: number | null;
}

export function UserDetailModal({ isOpen, onClose, userId }: UserDetailModalProps) {
    const { colorFillAlter } = useAppTheme();
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

    const { data: user, isFetching } = useGetUserById(
        userId!,
        !!userId && isOpen
    );

    const { data: latestVerification } = useGetLatestVerification(userId!, !!userId && isOpen);

    const getVerificationAction = () => {
        if (!latestVerification) return null;

        if (user?.isVerified) {
            return {
                label: 'Xem hồ sơ',
                type: 'link' as const,
            };
        }

        return {
            label: 'Duyệt hồ sơ',
            type: 'primary' as const,
        };
    };

    const verificationAction = getVerificationAction();

    return (
        <>
            <AppModal
                isOpen={isOpen}
                onClose={onClose}
                title="Thông tin chi tiết người dùng"
                width={700}
            >
                {isFetching || !user ? (
                    <div className="py-4">
                        <Skeleton avatar active paragraph={{ rows: 6 }} />
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {/* Header: Avatar & Thông tin cơ bản */}
                        <Flex align="center" gap={16} className="p-4 rounded-lg" style={{ backgroundColor: colorFillAlter }}>
                            <Avatar
                                size={72}
                                src={user.avatar}
                                icon={<UserOutlined />}
                                style={{ backgroundColor: '#ccc' }}
                            />
                            <Flex vertical className="flex-1">
                                <Text strong className="text-xl">{user.name}</Text>
                                <Text type="secondary">{user.email}</Text>
                                <div className="mt-2">
                                    <Tag color={USER_ROLE_COLOR[user.role]} className="border-none m-0">
                                        {USER_ROLE_LABEL[user.role]}
                                    </Tag>
                                </div>
                            </Flex>

                            {/* Trạng thái xác thực */}
                            <div className="flex flex-col items-end gap-2">
                                {user.isVerified ? (
                                    <Tag icon={<CheckCircleFilled />} color="success" className="m-0 py-1 px-2 text-sm border-none">
                                        Đã xác thực
                                    </Tag>
                                ) : (
                                    <Tag icon={<CloseCircleFilled />} color="default" className="m-0 py-1 px-2 text-sm border-none">
                                        Chưa xác thực
                                    </Tag>
                                )}

                                {/* {latestVerification && (
                                    <Button
                                        type="link"
                                        size="small"
                                        onClick={() => setIsVerificationModalOpen(true)}
                                        className="p-0 h-auto text-[13px]"
                                    >
                                        Xem hồ sơ xác thực
                                    </Button>
                                )} */}
                                {verificationAction && (
                                    <Button
                                        type={verificationAction.type}
                                        size="small"
                                        onClick={() => setIsVerificationModalOpen(true)}
                                        className="p-0 h-auto text-[13px]"
                                    >
                                        {verificationAction.label}
                                    </Button>
                                )}
                            </div>
                        </Flex>

                        {/* Bảng chi tiết thông tin */}
                        <Descriptions
                            bordered
                            column={2}
                            size="small"
                            labelStyle={{ width: '140px', backgroundColor: colorFillAlter, fontWeight: 500 }}
                        >
                            <Descriptions.Item label="Mã định danh" span={2}>
                                <Text className="font-mono">#{user.id}</Text>
                            </Descriptions.Item>

                            <Descriptions.Item label="Giới tính">
                                <Text strong>{GENDER_LABEL[user.gender] || 'Chưa xác định'}</Text>
                            </Descriptions.Item>

                            <Descriptions.Item label="Số điện thoại">
                                {user.phone || <Text type="secondary" italic>Chưa cập nhật</Text>}
                            </Descriptions.Item>

                            <Descriptions.Item label="Số dư" span={2}>
                                <Text strong style={{ color: '#52c41a' }}>
                                    {formatCurrency(user.balance || 0)}
                                </Text>
                            </Descriptions.Item>

                            <Descriptions.Item label="Địa chỉ" span={2}>
                                {user.address || <Text type="secondary" italic>Chưa cập nhật</Text>}
                            </Descriptions.Item>

                            <Descriptions.Item label="Ngày tham gia" span={2}>
                                {formatDateTime(user.createdAt)}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                )}
            </AppModal>

            {latestVerification && (
                <VerificationReviewModal
                    isOpen={isVerificationModalOpen}
                    onClose={() => setIsVerificationModalOpen(false)}
                    submission={latestVerification}
                />
            )}
        </>
    );
}