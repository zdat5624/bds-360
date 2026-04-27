// @/features/users/components/verification-history.modal.tsx
'use client';

import { TableActionDropdown } from '@/components/composite';
import { VerificationSubmission } from '@/features/users/api/types';
import { useGetMyVerificationHistory } from '@/features/users/api/user.queries';
import { DATE_FORMAT, formatDate } from '@/utils/date.util';
import { EyeOutlined } from '@ant-design/icons';
import { Modal, Table, Tag, Typography } from 'antd';
import { useState } from 'react';
import { VerificationDetailModal } from './verification-detail.modal'; // 🌟 Sẽ tạo ở bước 2

const { Text } = Typography;

interface VerificationHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function VerificationHistoryModal({ isOpen, onClose }: VerificationHistoryModalProps) {
    const [page, setPage] = useState(1);
    const pageSize = 5;

    // 🌟 State để quản lý Modal chi tiết
    const [detailModalData, setDetailModalData] = useState<VerificationSubmission | null>(null);

    const { data, isFetching } = useGetMyVerificationHistory({
        page: page - 1,
        size: pageSize,
        sortBy: 'createdAt',
        sortDirection: 'DESC'
    });

    const columns = [
        {
            title: 'Ngày nộp',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => <Text>{formatDate(text, DATE_FORMAT.FULL_TIME)}</Text>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                switch (status) {
                    case 'APPROVED': return <Tag color="green">Đã duyệt</Tag>;
                    case 'REJECTED': return <Tag color="red">Từ chối</Tag>;
                    default: return <Tag color="blue">Đang chờ</Tag>;
                }
            },
        },
        {
            title: 'Ghi chú duyệt',
            dataIndex: 'reviewNote',
            key: 'reviewNote',
            render: (text: string) => <Text type="secondary" className="italic">{text || '-'}</Text>,
        },
        {
            title: 'Ngày xử lý',
            dataIndex: 'reviewedAt',
            key: 'reviewedAt',
            render: (text?: string) => text ? <Text>{formatDate(text, DATE_FORMAT.FULL_TIME)}</Text> : '-',
        },
        // 🌟 THÊM CỘT ACTION Ở ĐÂY
        {
            title: '',
            key: 'action',
            width: 40,
            align: 'center' as const,
            fixed: 'right' as const,
            render: (_: unknown, record: VerificationSubmission) => (
                <TableActionDropdown
                    actions={[
                        {
                            key: 'view_detail',
                            label: 'Xem chi tiết',
                            icon: <EyeOutlined />,
                            onClick: () => setDetailModalData(record),
                        }
                    ]}
                />
            ),
        },
    ];

    return (
        <>
            <Modal
                title="Lịch sử yêu cầu xác thực"
                open={isOpen}
                onCancel={onClose}
                footer={null}
                width={800}
                destroyOnHidden
                centered
            >
                <div className="mt-4">
                    <Table<VerificationSubmission>
                        dataSource={data?.content || []}
                        columns={columns}
                        rowKey="id"
                        loading={isFetching}
                        pagination={{
                            current: page,
                            pageSize: pageSize,
                            total: data?.totalElements || 0,
                            onChange: (newPage) => setPage(newPage),
                            showSizeChanger: false,
                        }}
                        scroll={{ x: 600 }}
                    />
                </div>
            </Modal>

            {/* 🌟 Gắn Modal hiển thị chi tiết (Hình ảnh CCCD/CMND) */}
            <VerificationDetailModal
                submission={detailModalData}
                onClose={() => setDetailModalData(null)}
            />
        </>
    );
}