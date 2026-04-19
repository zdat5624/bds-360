// @/app/(main)/(account)/user/posts/page.tsx
'use client';

import { DataTable, TableState } from '@/components/base';
import { TableActionDropdown } from '@/components/composite/table-action.dropdown';
import { APP_ROUTES } from '@/config/routes';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatCurrency, formatDateTime } from '@/utils';
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
import { useState } from 'react';

// Import từ module posts
import { useGetPosts } from '@/features/posts/api/posts.queries';
import { Post, PostFilterParams } from '@/features/posts/api/types';
import { DeletePostModal } from '@/features/posts/components/delete-post.modal';
import { PostDetailModal } from '@/features/posts/components/post-detail.modal';
import {
    POST_STATUS_LABEL,
    POST_STATUS_OPTIONS,
    PostStatus,
} from '@/features/posts/posts.constant';

const { Title, Text } = Typography;

export default function UserPostsPage() {
    // --- HOOKS & THEME ---
    const { colorPrimary, colorTextSecondary, colorText, colorError, colorWarning, colorSuccess } = useAppTheme();
    const router = useRouter();

    // --- STATE BỘ LỌC ---
    const [filters, setFilters] = useState<PostFilterParams>({
        page: 0,
        size: 10,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
        status: undefined, // Mặc định Tab "Tất cả"
    });

    // --- STATE BẬT TẮT MODAL ---
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; post: Post | null }>({
        isOpen: false,
        post: null,
    });

    const [detailModal, setDetailModal] = useState<{ isOpen: boolean; postId: number | null }>({
        isOpen: false,
        postId: null,
    });

    const tableState: TableState = {
        currentPage: (filters.page ?? 0) + 1,
        pageSize: filters.size ?? 10,
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection,
    };

    const handleTableStateChange = (newState: TableState) => {
        setFilters((prev) => ({
            ...prev,
            page: newState.currentPage - 1,
            size: newState.pageSize,
            sortBy: newState.sortBy || 'createdAt',
            sortDirection: newState.sortDirection || 'DESC',
        }));
    };

    // Gọi hook lấy danh sách bài đăng của "TÔI" (scope = 'my')
    const { data, isFetching } = useGetPosts('my', filters);

    // --- HANDLERS BỘ LỌC ---
    const handleTabChange = (key: string) => {
        setFilters((prev) => ({
            ...prev,
            page: 0,
            status: key === 'ALL' ? undefined : (key as PostStatus),
        }));
    };

    // --- HELPER RENDER TAG TRẠNG THÁI ---
    const getStatusColor = (status: PostStatus) => {
        switch (status) {
            case 'APPROVED': return colorSuccess;
            case 'PENDING': return colorWarning;
            case 'REVIEW_LATER': return colorPrimary;
            case 'REJECTED':
            case 'BLOCKED':
            case 'EXPIRED':
                return colorError;
            default: return colorTextSecondary;
        }
    };

    // --- ĐỊNH NGHĨA CỘT BẢNG ---
    const columns: ColumnsType<Post> = [
        {
            title: 'Mã tin',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            align: 'center',
            render: (id: number) => <Text strong>#{id}</Text>,
        },
        {
            title: 'Thông tin bài đăng',
            dataIndex: 'title',
            key: 'title',
            width: '35%',
            render: (title: string, record: Post) => (
                <div className="flex flex-col gap-1">
                    <span className="font-semibold line-clamp-2 break-words" style={{ color: colorText }}>
                        {title}
                    </span>
                    <span className="text-xs" style={{ color: colorTextSecondary }}>
                        {record.districtName}, {record.provinceName}
                    </span>
                </div>
            ),
        },
        {
            title: 'Mức giá',
            dataIndex: 'price',
            key: 'price',
            align: 'right',
            sorter: true,
            render: (price: number, record: Post) => (
                <div className="flex flex-col items-end">
                    <span className="font-medium" style={{ color: colorError }}>
                        {formatCurrency(price)}
                    </span>
                    <span className="text-xs" style={{ color: colorTextSecondary }}>
                        {record.area} m²
                    </span>
                </div>
            ),
        },
        {
            title: 'Lượt xem',
            dataIndex: 'view',
            key: 'view',
            align: 'center',
            sorter: true,
            render: (view: number) => <span>{view.toLocaleString()}</span>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status: PostStatus) => (
                <Tag color={getStatusColor(status)} variant="filled">
                    {POST_STATUS_LABEL[status]}
                </Tag>
            ),
        },
        {
            title: 'Ngày đăng',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'right',
            sorter: true,
            render: (date: string) => formatDateTime(date),
        },
        {
            title: '',
            key: 'action',
            width: 40,
            align: 'center',
            fixed: 'right',
            render: (_, record) => {
                const actions = [
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
                        // Chặn sửa nếu bài đã bị khóa hoặc hết hạn (tuỳ logic của bạn)
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
                ];

                return <TableActionDropdown actions={actions} />;
            },
        },
    ];

    return (
        <div className="w-full flex flex-col gap-4">
            {/* 1. KHU VỰC HEADER */}
            <div>
                <div className="flex flex-wrap justify-between items-start sm:items-center gap-4">
                    <div>
                        <Title level={3} className="!m-0 flex items-center gap-2">
                            <FileTextOutlined />
                            Quản lý tin đăng
                        </Title>
                        <Text type="secondary" className="mt-1 block">
                            Theo dõi lượt xem, chỉnh sửa thông tin hoặc đăng mới các bất động sản của bạn.
                        </Text>
                    </div>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => router.push(APP_ROUTES.USER.CREATE_POST)}
                        className="h-9 w-full sm:w-auto"
                    >
                        Đăng tin mới
                    </Button>
                </div>
                <Divider className="!mt-4 !mb-0" />
            </div>

            {/* 2. KHU VỰC THANH CÔNG CỤ (Action Bar) */}
            <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                <div className="min-w-0 overflow-hidden max-w-full flex-1">
                    <Tabs
                        activeKey={filters.status || 'ALL'}
                        onChange={handleTabChange}
                        className="[&_.ant-tabs-nav]:!mb-0"
                        items={[
                            { key: 'ALL', label: 'Tất cả' },
                            ...POST_STATUS_OPTIONS.map(opt => ({ key: opt.value, label: opt.label }))
                        ]}
                    />
                </div>
            </div>

            {/* 3. KHU VỰC BẢNG DỮ LIỆU */}
            <DataTable<Post>
                columns={columns}
                data={data?.content || []}
                total={data?.totalElements || 0}
                loading={isFetching}
                tableState={tableState}
                onChangeState={handleTableStateChange}
                rowKey="id"
                onRowClick={(record) => setDetailModal({ isOpen: true, postId: record.id })}
            />

            {/* 4. MODALS */}
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