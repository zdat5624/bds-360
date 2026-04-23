'use client';

import { AppModal } from '@/components/base/app.modal';
import { USER_ROLE_COLOR, USER_ROLE_LABEL } from '@/constants';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatCurrency, formatDateTime } from '@/utils';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Descriptions, Flex, Skeleton, Tag, Typography } from 'antd';
import { useGetUserById } from '../api/user.queries';

const { Text } = Typography;

interface UserDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: number | null;
}



// Map nhãn giới tính (nếu constants chưa có bạn có thể dùng trực tiếp ở đây)
const GENDER_MAP: Record<string, string> = {
    MALE: 'Nam',
    FEMALE: 'Nữ',
    OTHER: 'Khác',
};

export function UserDetailModal({ isOpen, onClose, userId }: UserDetailModalProps) {
    const { colorTextSecondary, colorText, colorFillAlter } = useAppTheme();

    const { data: user, isFetching } = useGetUserById(
        userId!,
        !!userId && isOpen
    );

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            title="Thông tin chi tiết người dùng"
            width={650}
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
                            size={64}
                            src={user.avatar}
                            icon={<UserOutlined />}
                            style={{ backgroundColor: '#ccc' }}
                        />
                        <Flex vertical>
                            <Text strong className="text-lg">{user.name}</Text>
                            <Text type="secondary">{user.email}</Text>
                        </Flex>
                    </Flex>

                    {/* Bảng chi tiết thông tin */}
                    <Descriptions
                        bordered
                        column={1}
                        size="middle"
                        labelStyle={{ width: '180px', backgroundColor: colorFillAlter, fontWeight: 500 }}
                    >
                        <Descriptions.Item label="Mã định danh (ID)">
                            <Text className="font-mono">{user.id}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Vai trò hệ thống">


                            <Tag color={USER_ROLE_COLOR[user.role]}>
                                {USER_ROLE_LABEL[user.role]}
                            </Tag>
                        </Descriptions.Item>

                        {/* TRƯỜNG GIỚI TÍNH BẠN YÊU CẦU */}
                        <Descriptions.Item label="Giới tính">
                            <Text strong>{GENDER_MAP[user.gender] || 'Chưa xác định'}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Số điện thoại">
                            {user.phone || <Text type="secondary" italic>Chưa cập nhật</Text>}
                        </Descriptions.Item>

                        <Descriptions.Item label="Số dư tài khoản">
                            <Text strong style={{ color: '#52c41a' }}>
                                {formatCurrency(user.balance || 0)}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Địa chỉ">
                            {user.address || <Text type="secondary" italic>Chưa cập nhật</Text>}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tham gia">
                            {formatDateTime(user.createdAt)}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            )}
        </AppModal>
    );
}