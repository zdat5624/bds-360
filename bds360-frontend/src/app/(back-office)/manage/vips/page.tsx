'use client';

import { DataTable, TableState } from '@/components/base';
import { TableActionDropdown } from '@/components/composite';
import { APP_ROUTES } from '@/config';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatCurrency } from '@/utils';
import { EditOutlined } from '@ant-design/icons';
import { Flex, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import { getPageMeta } from '@/constants';
import { VIP_PACKAGES } from '@/constants/vip-packages.constant';
import { useGetVips, Vip } from '@/features/vips';
import { UpdateVipPriceModal } from '@/features/vips/components/update-vip-price.modal';

const { Title, Text } = Typography;

export default function ManageVipsPage() {
    const { colorBgContainer, colorBorderSecondary } = useAppTheme();
    const { icon, title } = getPageMeta(APP_ROUTES.MANAGE.VIPS);

    const { data: vips, isLoading } = useGetVips();

    const [tableState, setTableState] = useState<TableState>({
        currentPage: 1,
        pageSize: 10,
    });

    const [editModal, setEditModal] = useState<{ isOpen: boolean; vip: Vip | null }>({
        isOpen: false,
        vip: null,
    });

    const columns: ColumnsType<Vip> = [
        {
            title: 'Cấp độ',
            dataIndex: 'vipLevel',
            key: 'vipLevel',
            width: 100,
            align: 'center',
            render: (level: number) => {
                const pkg = VIP_PACKAGES.find(p => p.vipLevel === level);
                return <Tag color={pkg?.tagColor || 'default'} className="font-bold">VIP {level}</Tag>;
            },
        },
        {
            title: 'Tên hiển thị',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => <Text strong>{name}</Text>,
        },
        {
            title: 'Đơn giá hiện tại',
            dataIndex: 'pricePerDay',
            key: 'pricePerDay',
            align: 'right',
            width: 200,
            render: (price: number) => (
                <Text strong style={{ color: price > 0 ? '#f5222d' : '#52c41a', fontSize: 15 }}>
                    {price > 0 ? `${formatCurrency(price)} / ngày` : 'Miễn phí'}
                </Text>
            ),
        },
        {
            title: '',
            key: 'action',
            width: 60,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <TableActionDropdown actions={[
                    {
                        key: 'edit_price',
                        label: 'Cập nhật giá',
                        icon: <EditOutlined />,
                        onClick: () => setEditModal({ isOpen: true, vip: record }),
                    },
                ]} />
            ),
        },
    ];

    return (
        <div className="w-full flex flex-col gap-4">
            <Flex vertical>
                <Title level={3} style={{ margin: 0 }}>
                    <span style={{ marginRight: 8 }}>{icon}</span>
                    {title}
                </Title>
                <Text type="secondary" style={{ marginTop: 4 }}>
                    Thiết lập bảng giá niêm yết cho các gói dịch vụ đẩy tin trên toàn hệ thống.
                </Text>
            </Flex>

            <div
                className="w-full flex flex-col rounded-lg shadow-sm overflow-hidden"
                style={{ backgroundColor: colorBgContainer, border: `1px solid ${colorBorderSecondary}` }}
            >
                <div
                    className="flex justify-between items-center border-b p-4"
                    style={{ borderColor: colorBorderSecondary }}
                >
                    <Text strong type="secondary" className="uppercase text-[11px] tracking-wider">
                        Danh sách gói dịch vụ ({vips?.length || 0})
                    </Text>
                </div>

                <div className="!w-full  pt-2 px-4 pb-4">
                    <DataTable<Vip>
                        columns={columns}
                        data={vips || []}
                        total={vips?.length || 0}
                        loading={isLoading}
                        tableState={tableState}
                        onChangeState={setTableState}
                        rowKey="id"
                        bordered={false}
                        showPaging={false}
                    />
                </div>
            </div>

            <UpdateVipPriceModal
                isOpen={editModal.isOpen}
                vip={editModal.vip}
                onClose={() => setEditModal({ isOpen: false, vip: null })}
            />
        </div>
    );
}