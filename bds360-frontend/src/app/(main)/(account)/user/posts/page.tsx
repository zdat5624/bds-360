'use client';

import { DataTable, FilterButton, TableState } from '@/components/base';
import { TableActionDropdown } from '@/components/composite';
import { APP_ROUTES } from '@/config/routes';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatCurrency, formatDateTime, formatPostPrice } from '@/utils';
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    FileTextOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { Button, Divider, Tabs, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

// Import từ module features/posts
import {
    DeletePostModal,
    Post,
    PostDetailModal,
    PostFilterModal,
    PostFilterParams,
    useGetPosts
} from '@/features/posts';

import {
    POST_STATUS_COLOR,
    POST_STATUS_LABEL,
    PostStatus,
    USER_POST_STATUS_DISPLAY,
    USER_POST_STATUS_OPTIONS,
} from '@/features/posts/posts.constant';

const { Title, Text } = Typography;

export default function UserPostsPage() {
    // --- HOOKS & THEME ---
    const { colorError, colorText, colorBorderSecondary } = useAppTheme();
    const router = useRouter();

    // --- STATE BỘ LỌC ---
    const [filters, setFilters] = useState<PostFilterParams>({
        page: 0,
        size: 10,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
        statuses: undefined,
    });

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // --- TÍNH TOÁN SỐ LƯỢNG FILTER ĐANG ACTIVE ---
    const activeFilterCount = useMemo(() => {
        const excludeFields = ['page', 'size', 'sortBy', 'sortDirection', 'statuses'];
        return Object.keys(filters).filter(
            (key) =>
                !excludeFields.includes(key) &&
                filters[key as keyof PostFilterParams] !== undefined &&
                filters[key as keyof PostFilterParams] !== ''
        ).length;
    }, [filters]);

    // --- STATE MODAL ---
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; post: Post | null }>({
        isOpen: false,
        post: null,
    });
    const [detailModal, setDetailModal] = useState<{ isOpen: boolean; postId: number | null }>({
        isOpen: false,
        postId: null,
    });

    // --- DATA FETCHING ---
    const { data, isFetching } = useGetPosts('my', filters);

    // --- HANDLERS ---
    const handleTableStateChange = (newState: TableState) => {
        setFilters((prev) => ({
            ...prev,
            page: newState.currentPage - 1,
            size: newState.pageSize,
            sortBy: newState.sortBy || 'createdAt',
            sortDirection: newState.sortDirection || 'DESC',
        }));
    };

    const handleTabChange = (key: string) => {
        let statuses: PostStatus[] | undefined = undefined;

        if (key !== 'ALL') {
            // 🌟 TỰ XỬ LÝ LOGIC GỘP TẠI PAGE: APPROVED bao gồm cả REVIEW_LATER
            if (key === 'APPROVED') {
                statuses = ['APPROVED', 'REVIEW_LATER'];
            } else {
                statuses = [key as PostStatus];
            }
        }

        setFilters((prev) => ({
            ...prev,
            page: 0,
            statuses: statuses,
        }));
    };

    const handleApplyFilterModal = (values: Partial<PostFilterParams>) => {
        setFilters((prev) => ({
            ...prev,
            ...values,
            page: 0,
        }));
    };

    const handleQuickClear = () => {
        setFilters({
            page: 0,
            size: 10,
            sortBy: 'createdAt',
            sortDirection: 'DESC',
            statuses: filters.statuses, // Giữ lại tab hiện tại
        });
    };

    // Xác định Tab nào đang active dựa trên mảng statuses
    const activeTabKey = useMemo(() => {
        if (!filters.statuses || filters.statuses.length === 0) return 'ALL';
        if (filters.statuses.includes('APPROVED')) return 'APPROVED';
        return filters.statuses[0];
    }, [filters.statuses]);

    // --- ĐỊNH NGHĨA CỘT BẢNG ---
    const columns: ColumnsType<Post> = [
        {
            title: 'Mã tin',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            align: 'center',
            sorter: true,
            render: (id: number) => <Text strong style={{ color: colorText }}>#{id}</Text>,
        },
        {
            title: 'Thông tin bài đăng',
            dataIndex: 'title',
            key: 'title',
            width: '35%',
            render: (title: string, record: Post) => (
                <div className="flex flex-col gap-0.5">
                    <Text strong className="line-clamp-1 break-words">{title}</Text>
                    <Text type="secondary" className="text-xs">
                        {record.districtName}, {record.provinceName}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Diện tích',
            dataIndex: 'area',
            key: 'area',
            width: 120,
            align: 'right',
            sorter: true,
            render: (area: number) => <Text>{area} m²</Text>,
        },
        {
            title: 'Mức giá',
            dataIndex: 'price',
            key: 'price',
            align: 'right',
            width: 150,
            sorter: true,
            render: (price: number, record: Post) => (
                <div className="flex flex-col items-end">
                    <Text strong style={{ color: colorError }}>
                        {formatPostPrice(price, record.type)}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '10px' }}>
                        {formatCurrency(price)}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: 140,
            render: (status: PostStatus) => {
                // 🌟 TẬN DỤNG CONSTANT ĐỂ HIỂN THỊ: REVIEW_LATER -> APPROVED
                const displayKey = USER_POST_STATUS_DISPLAY[status];
                return (
                    <Tag color={POST_STATUS_COLOR[displayKey]} variant="filled">
                        {POST_STATUS_LABEL[displayKey]}
                    </Tag>
                );
            },
        },
        {
            title: 'Ngày đăng',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'right',
            width: 160,
            sorter: true,
            render: (date: string) => formatDateTime(date),
        },
        {
            title: '',
            key: 'action',
            width: 50,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <TableActionDropdown actions={[
                    {
                        key: 'view_detail',
                        label: 'Xem chi tiết',
                        icon: <EyeOutlined />,
                        onClick: () => setDetailModal({ isOpen: true, postId: record.id }),
                    },
                    {
                        key: 'edit_post',
                        label: 'Chỉnh sửa',
                        icon: <EditOutlined />,
                        disabled: record.status === 'BLOCKED' || record.status === 'EXPIRED',
                        onClick: () => router.push(APP_ROUTES.USER.EDIT_POST(record.id)),
                    },
                    {
                        key: 'delete_post',
                        label: 'Xóa tin',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => setDeleteModal({ isOpen: true, post: record }),
                    },
                ]} />
            ),
        },
    ];

    return (
        <div className="w-full flex flex-col gap-4">
            {/* 1. HEADER SECTION */}
            <div className="flex flex-wrap justify-between items-start sm:items-center gap-4">
                <div>
                    <Title level={3} className="!m-0 flex items-center gap-2">
                        <FileTextOutlined /> Quản lý tin đăng
                    </Title>
                    <Text type="secondary" className="mt-1 block">
                        Theo dõi hiệu quả và quản lý danh sách bất động sản của bạn.
                    </Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => router.push(APP_ROUTES.USER.CREATE_POST)}
                    size="large"
                >
                    Đăng tin mới
                </Button>
            </div>

            <Divider className="!m-0" />

            {/* 2. ACTION BAR & TABS */}
            <div className="w-full overflow-hidden">
                <Tabs
                    activeKey={activeTabKey}
                    onChange={handleTabChange}
                    className="[&_.ant-tabs-nav]:!mb-0 [&_.ant-tabs-nav::before]:hidden [&_.ant-tabs-nav-list]:border-b"
                    style={{ ['--tabs-border-color' as any]: colorBorderSecondary }}
                    tabBarExtraContent={{
                        right: (
                            <div className="pl-4">
                                <FilterButton
                                    activeCount={activeFilterCount}
                                    onClick={() => setIsFilterModalOpen(true)}
                                    onClear={handleQuickClear}
                                />
                            </div>
                        )
                    }}
                    items={[
                        { key: 'ALL', label: 'Tất cả' },
                        ...USER_POST_STATUS_OPTIONS.map((o: { value: string; label: string }) => ({
                            key: o.value,
                            label: o.label
                        }))
                    ]}
                />
            </div>

            {/* 3. DATA TABLE */}
            <DataTable<Post>
                columns={columns}
                data={data?.content || []}
                total={data?.totalElements || 0}
                loading={isFetching}
                tableState={{
                    currentPage: (filters.page ?? 0) + 1,
                    pageSize: filters.size ?? 10,
                    sortBy: filters.sortBy,
                    sortDirection: filters.sortDirection,
                }}
                onChangeState={handleTableStateChange}
                rowKey="id"
                onRowClick={(record) => setDetailModal({ isOpen: true, postId: record.id })}
            />

            {/* 4. MODALS */}
            <PostFilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleApplyFilterModal}
                initialValues={filters}
            />

            <DeletePostModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, post: null })}
                postId={deleteModal.post?.id || null}
                postTitle={deleteModal.post?.title}
            />

            <PostDetailModal
                isOpen={detailModal.isOpen}
                postId={detailModal.postId}
                onClose={() => setDetailModal({ isOpen: false, postId: null })}
            />
        </div>
    );
}