'use client';

import { DataTable, TableState } from '@/components/base';
import { ConfirmModal } from '@/components/base/confirm.modal';
import { TableActionDropdown } from '@/components/composite';
import { APP_ROUTES } from '@/config';
import { getPageMeta, LISTING_TYPE_COLOR, LISTING_TYPE_LABEL, ListingType } from '@/constants';
import {
    Category,
    CategoryFilterParams,
    useDeleteCategory,
    useGetCategories
} from '@/features/categories';
import { CategoryFormModal } from '@/features/categories/components/category-form.modal';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getErrorMessage } from '@/utils/error.util';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { App, Button, Flex, Input, Segmented, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

const { Title, Text } = Typography;

export default function ManageCategoriesPage() {
    const { message } = App.useApp();
    const { colorBgContainer, colorBorderSecondary, colorTextSecondary } = useAppTheme();
    const { icon, title } = getPageMeta(APP_ROUTES.MANAGE.CATEGORIES);

    // --- STATES ---
    const [filters, setFilters] = useState<CategoryFilterParams>({
        page: 0,
        size: 10,
        name: '',
        type: undefined,
    });

    const [formModal, setFormModal] = useState<{ isOpen: boolean; data: Category | null }>({
        isOpen: false,
        data: null,
    });

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null,
    });

    // --- DATA FETCHING ---
    const { data, isFetching } = useGetCategories(filters, true);


    const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory();

    // --- HANDLERS ---
    const handleTableChange = (newState: TableState) => {
        setFilters(prev => ({
            ...prev,
            page: newState.currentPage - 1,
            size: newState.pageSize,
        }));
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await deleteCategory(deleteModal.id);
            message.success('Đã xóa danh mục thành công');
            setDeleteModal({ isOpen: false, id: null });
        } catch (error) {
            message.error(getErrorMessage(error) || 'Xóa danh mục thất bại');
        }
    };

    const columns: ColumnsType<Category> = [
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => <Text strong>{name}</Text>,
        },
        {
            title: 'Loại hình',
            dataIndex: 'type',
            key: 'type',
            width: 200,
            render: (type: ListingType) => (
                <Tag
                    color={LISTING_TYPE_COLOR[type]}
                    variant='filled'
                    className="font-medium"
                >
                    {LISTING_TYPE_LABEL[type]}
                </Tag>
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
                        key: 'edit',
                        label: 'Chỉnh sửa',
                        icon: <EditOutlined />,
                        onClick: () => setFormModal({ isOpen: true, data: record }),
                    },
                    {
                        key: 'delete',
                        label: 'Xóa danh mục',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => setDeleteModal({ isOpen: true, id: record.id }),
                    },
                ]} />
            ),
        },
    ];

    return (
        <div className="w-full flex flex-col gap-4">
            {/* 1. Header */}
            <Flex vertical>
                <Title level={3} style={{ margin: 0 }}>
                    <span style={{ marginRight: 8 }}>{icon}</span>
                    {title}
                </Title>
                <Text type="secondary" style={{ marginTop: 4 }}>
                    Quản lý các loại hình bất động sản hiển thị trên website (Bán/Cho thuê).
                </Text>
            </Flex>

            {/* 2. Main Box */}
            <div
                className="w-full flex flex-col rounded-lg shadow-sm  overflow-hidden"
                style={{ backgroundColor: colorBgContainer, border: `1px solid ${colorBorderSecondary}` }}
            >

                <div
                    className="flex flex-wrap justify-between gap-3 items-center border-b px-4 py-4 "
                    style={{ borderColor: colorBorderSecondary }}
                >
                    {/* Nhóm bên trái: Lọc và Tìm kiếm */}
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                        <Segmented
                            options={[
                                { label: 'Tất cả', value: 'ALL' },
                                { label: 'Bán', value: 'SALE' },
                                { label: 'Cho thuê', value: 'RENT' },
                            ]}
                            value={filters.type || 'ALL'}
                            onChange={(val) => setFilters(prev => ({
                                ...prev,
                                type: val === 'ALL' ? undefined : (val as any),
                                page: 0
                            }))}
                        />
                        <Input
                            placeholder="Tìm tên danh mục..."
                            prefix={<SearchOutlined style={{ color: colorTextSecondary }} />}
                            className="sm:!w-64 w-full"
                            allowClear
                            onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value, page: 0 }))}
                        />
                    </div>

                    {/* Nhóm bên phải: Nút Thêm mới */}
                    <div className="w-full sm:w-auto flex-shrink-0">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            className="w-full sm:w-auto"
                            onClick={() => setFormModal({ isOpen: true, data: null })}
                        >
                            Tạo mới
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="w-full  px-4 py-2">
                    <DataTable<Category>
                        columns={columns}
                        data={data?.content || []}
                        total={data?.totalElements || 0}
                        loading={isFetching}
                        tableState={{
                            currentPage: filters.page! + 1,
                            pageSize: filters.size!,
                        }}
                        onChangeState={handleTableChange}
                        rowKey="id"
                        bordered={false}
                    />
                </div>
            </div>

            {/* Modals */}
            <CategoryFormModal
                isOpen={formModal.isOpen}
                category={formModal.data}
                onClose={() => setFormModal({ isOpen: false, data: null })}
            />

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Xác nhận xóa danh mục"
                content="Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác nếu danh mục đang có dữ liệu liên quan."
                type="danger"
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                okText="Xóa ngay"
            />
        </div>
    );
}