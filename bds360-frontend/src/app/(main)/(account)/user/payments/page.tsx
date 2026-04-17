// @/app/(main)/(account)/user/payments/page.tsx
'use client';

import { DataTable, TableState } from '@/components/base/data.table';
import { ActionItem, TableActionDropdown } from '@/components/composite/table-action.dropdown'; // 👈 Import component Dropdown 3 chấm
import { useAppTheme } from '@/hooks';
import { formatCurrency } from '@/utils';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Divider, Tag, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

const { Title, Text } = Typography;

interface PaymentRecord {
    id: string;
    transCode: string;
    amount: number;
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    createdAt: string;
}

const MOCK_DATA: PaymentRecord[] = [
    { id: '1', transCode: 'BDS_99182', amount: 500000, status: 'SUCCESS', createdAt: '2026-04-16 14:30:00' },
    { id: '2', transCode: 'BDS_99183', amount: 20000, status: 'PENDING', createdAt: '2026-04-15 09:15:00' },
    { id: '3', transCode: 'BDS_99184', amount: 100000, status: 'FAILED', createdAt: '2026-04-14 18:20:00' },
    { id: '4', transCode: 'BDS_99185', amount: 2000000, status: 'SUCCESS', createdAt: '2026-04-10 10:00:00' },
];

export default function UserPaymentsPage() {
    const { colorSuccess, colorPrimary } = useAppTheme();

    const [tableState, setTableState] = useState<TableState>({
        currentPage: 1,
        pageSize: 10,
    });
    const [loading, setLoading] = useState(false);

    // --- HÀNH ĐỘNG CỦA BẢNG ---
    const handleDetail = (record: PaymentRecord) => {
        message.info(`Xem chi tiết giao dịch: ${record.transCode}`);
    };

    const handleDelete = (record: PaymentRecord) => {
        message.error(`Bạn không được phép xóa giao dịch: ${record.transCode}`);
    };

    // --- ĐỊNH NGHĨA CỘT ---
    const columns: ColumnsType<PaymentRecord> = [
        {
            title: 'Mã giao dịch',
            dataIndex: 'transCode',
            key: 'transCode',
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            sorter: true,
            render: (amount) => (
                <span className="font-semibold text-blue-600">
                    {formatCurrency ? formatCurrency(amount) : `${amount} đ`}
                </span>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status: PaymentRecord['status']) => {
                const colorMap = { SUCCESS: 'success', PENDING: 'warning', FAILED: 'error' };
                const textMap = { SUCCESS: 'Thành công', PENDING: 'Đang xử lý', FAILED: 'Thất bại' };
                return <Tag color={colorMap[status]} bordered={false}>{textMap[status]}</Tag>;
            },
        },
        // 👇 CỘT ACTION MỚI (Sử dụng TableActionDropdown)
        {
            title: '', // Không để tiêu đề (Đúng như bạn đã yêu cầu)
            key: 'actions',
            width: 48, // Ép kích thước nhỏ lại chỉ vừa đủ nút 3 chấm
            fixed: 'right', // Ghim bên phải
            align: 'center',
            render: (_, record) => {
                // Khai báo mảng hành động cho dòng hiện tại
                const rowActions: ActionItem[] = [
                    {
                        key: 'detail',
                        label: 'Xem chi tiết',
                        icon: <EyeOutlined />,
                        onClick: () => handleDetail(record),
                        color: colorPrimary,

                    },
                    {
                        key: 'edit',
                        label: 'Chỉnh sửa',
                        icon: <EditOutlined />,
                        onClick: () => message.info(`Sửa: ${record.transCode}`),
                        color: colorSuccess,
                    },
                    {
                        key: 'delete',
                        label: 'Xóa giao dịch',
                        icon: <DeleteOutlined />,
                        danger: true, // Tự động tô đỏ
                        onClick: () => handleDelete(record),
                        disabled: record.status === 'SUCCESS', // Giao dịch SUCCESS thì mờ nút xóa
                    },
                ];

                // Render component 3 chấm
                return <TableActionDropdown actions={rowActions} />;
            },
        },
    ];

    return (
        <div className="w-full">
            <div className="mb-6">
                <Title level={3} style={{ margin: 0 }}>Lịch sử giao dịch</Title>
                <Text type="secondary" className="block mt-2">
                    Quản lý danh sách các biên lai nạp tiền và thanh toán gói dịch vụ của bạn.
                </Text>
            </div>

            <Divider className="!mt-6 !mb-[26px]" />

            {/* Bỏ cái box bọc bên ngoài đi, vì DataTable đã là một khối độc lập chuẩn SAAS rồi */}
            <DataTable<PaymentRecord>
                data={MOCK_DATA}
                total={MOCK_DATA.length}
                loading={loading}
                columns={columns}
                tableState={tableState}
                onChangeState={setTableState}
                rowKey="id"
            />
        </div>
    );
}