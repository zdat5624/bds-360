// @/features/transactions/components/transaction-detail.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { GENDER_LABEL } from '@/constants';
import { useGetUserById } from '@/features/users'; // Import hook từ feature users
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatCurrency, formatDateTime } from '@/utils';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Descriptions, Flex, Skeleton, Tag, Typography } from 'antd';
import { useGetTransactionById } from '../api/transactions.queries';
import {
    TRANSACTION_STATUS_COLOR,
    TRANSACTION_STATUS_LABEL,
    TRANSACTION_TYPE_LABEL
} from '../transactions.constant';

const { Text } = Typography;

interface TransactionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactionId: number | null;
}

export function TransactionDetailModal({ isOpen, onClose, transactionId }: TransactionDetailModalProps) {
    const { colorSuccess, colorTextSecondary, colorText, colorFillAlter } = useAppTheme();

    // 1. Lấy thông tin giao dịch
    const { data: transaction, isFetching: isFetchingTrans } = useGetTransactionById(
        transactionId ?? 0,
        !!transactionId && isOpen
    );

    // 2. Lấy chi tiết người dùng
    const { data: user, isFetching: isFetchingUser } = useGetUserById(
        transaction?.user?.id ?? 0,
        !!transaction?.user?.id && isOpen
    );

    const isLoading = isFetchingTrans || isFetchingUser;

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            title="Chi tiết giao dịch"
            width={650}
        >
            {isLoading || !transaction ? (
                <Skeleton active paragraph={{ rows: 8 }} />
            ) : (
                <div className="flex flex-col gap-6">
                    {/* --- PHẦN 1: THÔNG TIN KHÁCH HÀNG (Dữ liệu từ useGetUserById) --- */}
                    <Descriptions
                        title="Thông tin người thực hiện"
                        bordered
                        column={1}
                        size="middle"
                        styles={{
                            label: { width: '180px', color: colorTextSecondary, backgroundColor: colorFillAlter },
                            content: { fontWeight: 500, color: colorText }
                        }}
                    >
                        <Descriptions.Item label="Khách hàng">
                            <Flex align="center" gap={12}>
                                <Avatar src={user?.avatar} icon={<UserOutlined />} />
                                <Flex vertical>
                                    <Text strong>{user?.name || transaction.user.name}</Text>
                                    <Text type="secondary" className="text-[12px]">{user?.email || transaction.user.email}</Text>
                                </Flex>
                            </Flex>
                        </Descriptions.Item>

                        <Descriptions.Item label="Giới tính">
                            {user?.gender ? (GENDER_LABEL[user.gender] || user.gender) : '--'}
                        </Descriptions.Item>

                        <Descriptions.Item label="Số điện thoại">
                            {user?.phone || '--'}
                        </Descriptions.Item>
                    </Descriptions>

                    {/* --- PHẦN 2: CHI TIẾT GIAO DỊCH --- */}
                    <Descriptions
                        title="Chi tiết tài chính"
                        bordered
                        column={1}
                        size="middle"
                        styles={{
                            label: { width: '180px', color: colorTextSecondary, backgroundColor: colorFillAlter },
                            content: { fontWeight: 500, color: colorText }
                        }}
                    >
                        <Descriptions.Item label="Mã giao dịch HT">
                            <Text copyable={!!transaction.id} className="font-mono">{transaction.id || '--'}</Text>
                        </Descriptions.Item>

                        {transaction.txnId && (
                            <Descriptions.Item label="Mã giao dịch VNPAY">
                                <Text copyable={!!transaction.txnId} className="font-mono">{transaction.txnId || '--'}</Text>
                            </Descriptions.Item>
                        )}


                        <Descriptions.Item label="Loại giao dịch">
                            {TRANSACTION_TYPE_LABEL[transaction.type]}
                        </Descriptions.Item>

                        <Descriptions.Item label="Số tiền">
                            <span style={{ color: transaction.type === 'DEPOSIT' ? colorSuccess : colorText }}>
                                {transaction.type === 'DEPOSIT' ? '+' : '-'}
                                {formatCurrency(Math.abs(transaction.amount))}
                            </span>
                        </Descriptions.Item>

                        <Descriptions.Item label="Trạng thái">
                            <Tag color={TRANSACTION_STATUS_COLOR[transaction.status]} variant="filled" className="border-none">
                                {TRANSACTION_STATUS_LABEL[transaction.status]}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Thời gian tạo">
                            {formatDateTime(transaction.createdAt)}
                        </Descriptions.Item>
                        {/* <Descriptions.Item label="Thời gian tạo">
                            {formatDateTime(transaction.)}
                        </Descriptions.Item> */}

                        <Descriptions.Item label="Mô tả">
                            <Text style={{ fontWeight: 400 }}>{transaction.description || '--'}</Text>
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            )}
        </AppModal>
    );
}