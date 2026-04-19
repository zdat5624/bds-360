// @/features/transactions/components/transaction-detail.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatCurrency, formatDateTime } from '@/utils';
import { Descriptions, Skeleton, Tag } from 'antd';
import { useGetTransactionById } from '../api/transactions.queries';
import {
    TRANSACTION_STATUS_COLOR,
    TRANSACTION_STATUS_LABEL,
    TRANSACTION_TYPE_LABEL
} from '../transactions.constant';

interface TransactionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactionId: number | null;
}

export function TransactionDetailModal({ isOpen, onClose, transactionId }: TransactionDetailModalProps) {
    const { colorSuccess, colorTextSecondary, colorText } = useAppTheme();

    // Chỉ gọi API khi có transactionId
    const { data: transaction, isFetching } = useGetTransactionById(
        transactionId!,
        !!transactionId && isOpen
    );

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            title="Chi tiết giao dịch"
            width={600}
        >
            {isFetching || !transaction ? (
                <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
                <Descriptions
                    bordered
                    column={1}
                    size="middle"
                    styles={{
                        label: { width: '160px', color: colorTextSecondary },
                        content: { fontWeight: 500, color: colorText }
                    }}
                >
                    <Descriptions.Item label="Loại giao dịch">
                        {TRANSACTION_TYPE_LABEL[transaction.type]}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mã giao dịch">
                        {transaction.txnId || '--'}
                    </Descriptions.Item>



                    <Descriptions.Item label="Số tiền">
                        <span style={{ color: transaction.type === 'DEPOSIT' ? colorSuccess : colorText }}>
                            {transaction.type === 'DEPOSIT' ? '+' : '-'}
                            {formatCurrency(Math.abs(transaction.amount))}
                        </span>
                    </Descriptions.Item>

                    <Descriptions.Item label="Trạng thái">
                        <Tag color={TRANSACTION_STATUS_COLOR[transaction.status]} variant="filled">
                            {TRANSACTION_STATUS_LABEL[transaction.status]}
                        </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Thời gian tạo">
                        {formatDateTime(transaction.createdAt)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Mô tả chi tiết">
                        <span style={{ fontWeight: 400 }}>{transaction.description || '--'}</span>
                    </Descriptions.Item>
                </Descriptions>
            )}
        </AppModal>
    );
}