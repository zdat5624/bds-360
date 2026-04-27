// @/app/(back-office)/manage/posts/page.tsx
'use client';

import { DataTable, FilterButton, RefreshButton, TableState } from '@/components/base';
import { ConfirmModal } from '@/components/base/confirm.modal';
import { TableActionDropdown } from '@/components/composite';
import { APP_ROUTES } from '@/config';
import {
    formatPostPrice,
    MANAGE_POST_STATUS_OPTIONS,
    Post,
    POST_STATUS_COLOR,
    POST_STATUS_LABEL,
    PostFilterParams,
    PostStatus,
    useDeletePost,
    useGetPosts
} from '@/features/posts';
import { ManagePostDetailModal } from '@/features/posts/components/manage-post-detail.modal';
import { ManagePostFilterModal } from '@/features/posts/components/manage-post-filter.modal';
import { PostApprovalModal } from '@/features/posts/components/post-approval.modal';
import { PostUndoApprovalModal } from '@/features/posts/components/post-undo-approval.modal';
// 🌟 Import thêm 2 Modal mới
import { getPageMeta } from '@/constants';
import { PostBlockModal } from '@/features/posts/components/post-block.modal';
import { PostUnblockModal } from '@/features/posts/components/post-unblock.modal';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatDateTime, getErrorMessage } from '@/utils';
import { AppstoreOutlined, CheckCircleOutlined, DeleteOutlined, EyeOutlined, MenuOutlined, StopOutlined, UndoOutlined, UnlockOutlined } from '@ant-design/icons';
import { keepPreviousData } from '@tanstack/react-query';
import { App, Button, Flex, Segmented, Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const { Title, Text } = Typography;

export default function ManagePostsPage() {
    const { message } = App.useApp();
    const { colorBgContainer, colorBorderSecondary } = useAppTheme();
    const { icon, title } = getPageMeta(APP_ROUTES.MANAGE.POSTS);

    const defaultFilters = useMemo<PostFilterParams>(() => ({
        page: 0,
        size: 10,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
        statuses: undefined,
        search: undefined,
        searchBy: ['id', 'email'], // id - title - description - email
        type: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        minArea: undefined,
        maxArea: undefined,
        categoryId: undefined,
        vipId: undefined,
        isDeleteByUser: undefined,
        isHidden: undefined,
    }), []);

    const [filters, setFilters] = useState<PostFilterParams>(defaultFilters);
    const [activeTab, setActiveTab] = useState<string>('ALL');
    const [isInlineAction, setIsInlineAction] = useState<boolean>(true);

    // Modals state
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [detailModal, setDetailModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
    const [approvalModal, setApprovalModal] = useState<{ isOpen: boolean; data: Post | null }>({ isOpen: false, data: null });
    const [undoModal, setUndoModal] = useState<{ isOpen: boolean; data: Post | null }>({ isOpen: false, data: null });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
    // 🌟 Thêm State cho Block và Unblock
    const [blockModal, setBlockModal] = useState<{ isOpen: boolean; data: Post | null }>({ isOpen: false, data: null });
    const [unblockModal, setUnblockModal] = useState<{ isOpen: boolean; data: Post | null }>({ isOpen: false, data: null });

    const { data, isFetching } = useGetPosts('admin', filters, {
        placeholderData: keepPreviousData
    });


    const { mutateAsync: deletePost, isPending: isDeleting } = useDeletePost(true);

    useEffect(() => {
        if (filters.statuses && filters.statuses.length > 0) {
            setActiveTab(filters.statuses[0]);
        } else {
            setActiveTab('ALL');
        }
    }, [filters.statuses]);

    const isFilterChanged = useMemo(() => {
        return JSON.stringify(filters) !== JSON.stringify(defaultFilters);
    }, [filters, defaultFilters]);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.search) count++;
        if (filters.type) count++;
        if (filters.minPrice || filters.maxPrice) count++;
        if (filters.minArea || filters.maxArea) count++;
        if (filters.categoryId) count++;
        if (filters.vipId !== undefined) count++;
        if (filters.isDeleteByUser) count++;
        if (filters.isHidden) count++;
        if (filters.statuses && filters.statuses.length > 0) count++;
        return count;
    }, [filters]);

    const handleTableChange = (newState: TableState) => {
        setFilters(prev => ({
            ...prev,
            page: newState.currentPage - 1,
            size: newState.pageSize,
            sortBy: newState.sortBy,
            sortDirection: newState.sortDirection,
        }));
    };

    const handleTabChange = (val: string) => {
        setActiveTab(val);
        setFilters(prev => ({
            ...prev,
            statuses: val === 'ALL' ? undefined : [val as PostStatus],
            page: 0
        }));
    };

    const handleApplyFilter = (newFilters: Partial<PostFilterParams>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleResetFilters = () => {
        setActiveTab('ALL');
        setFilters({ ...defaultFilters });
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await deletePost(deleteModal.id);
            message.success('Đã xóa tin đăng thành công');
            setDeleteModal({ isOpen: false, id: null });
        } catch (error) {
            message.error(getErrorMessage(error) || 'Không thể xóa tin đăng này');
        }
    };

    const columns: ColumnsType<Post> = [
        {
            title: 'Mã tin',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            sorter: true,
            render: (id) => (
                <Link href={APP_ROUTES.PUBLIC.POST_DETAIL(id)} target="_blank" className="text-blue-600 hover:underline font-mono">
                    1{id}
                </Link>
            ),
        },
        {
            title: 'VIP',
            dataIndex: 'vip',
            key: 'vip',
            width: 80,
            align: 'center',
            sorter: true,
            render: (vip) => {
                const level = vip?.vipLevel || 0;
                let color = 'default';
                if (level === 1) color = 'gold';
                if (level >= 2) color = 'red';
                return <Tag color={color} className="m-0 font-medium">VIP {level}</Tag>;
            },
        },
        {
            title: 'Thông tin',
            key: 'info',
            render: (_, record) => (
                <Flex vertical>
                    <Text strong ellipsis style={{ maxWidth: 280 }}>{record.title}</Text>
                    <Flex gap={4} className="text-[12px] text-gray-500">
                        <Text ellipsis type="secondary">{record.category?.name}</Text>
                        <span>•</span>
                        <Text ellipsis type="secondary">{record.user?.email}</Text>
                    </Flex>
                </Flex>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 130,
            sorter: true,
            render: (status: PostStatus, record) => (
                <Flex vertical align="flex-start" gap={4}>
                    <Tag color={POST_STATUS_COLOR[status]} variant="filled" className="border-none m-0">
                        {POST_STATUS_LABEL[status]}
                    </Tag>
                    {record.deletedByUser && (
                        <Tag color="error" className="m-0 text-[10px] py-0 px-1 border-none">Đã bị xóa</Tag>
                    )}
                </Flex>
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            sorter: true,
            render: (price, record) => <Text strong>{formatPostPrice(price, record.type)}</Text>,
        },
        {
            title: 'Diện tích (m²)',
            dataIndex: 'area',
            key: 'area',
            width: 100,
            sorter: true,
            render: (area) => <Text>{area}</Text>,
        },
        {
            title: 'Lượt xem',
            dataIndex: 'view',
            key: 'view',
            width: 110,
            sorter: true,
        },

        {
            title: 'Ngày đăng',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 140,
            sorter: true,
            render: (date: string) => <Text type="secondary" className="text-[13px]">{formatDateTime(date)}</Text>,
        },
        {
            title: isInlineAction ? 'Thao tác' : '',
            key: 'action',
            width: isInlineAction ? 150 : 30, // Đã mở rộng thêm vì có thêm 1 nút Block/Unblock
            align: isInlineAction ? 'center' : 'center',
            fixed: 'right',
            render: (_, record) => {
                const canApprove = ['PENDING', 'REVIEW_LATER', 'APPROVED'].includes(record.status);
                const canUndo = ['APPROVED', 'REJECTED'].includes(record.status);
                const canBlock = ['APPROVED', 'REVIEW_LATER'].includes(record.status);
                const canUnblock = record.status === 'BLOCKED';

                if (isInlineAction) {
                    return (
                        <Flex gap={4} justify="flex-start mx-auto" align="center">
                            {/* Xem */}
                            <Tooltip title="Xem chi tiết" placement="top">
                                <Button
                                    type="text"
                                    icon={<EyeOutlined />}
                                    onClick={() => setDetailModal({ isOpen: true, id: record.id })}
                                    className="flex items-center justify-center !w-8 !h-8 !text-blue-600 hover:!bg-blue-50"
                                />
                            </Tooltip>

                            {/* Duyệt */}
                            {canApprove ? (
                                <Tooltip title="Kiểm duyệt" placement="top">
                                    <Button
                                        type="text"
                                        icon={<CheckCircleOutlined />}
                                        onClick={() => setApprovalModal({ isOpen: true, data: record })}
                                        className="flex items-center justify-center !w-8 !h-8 !text-emerald-600 hover:!bg-emerald-50"
                                    />
                                </Tooltip>
                            ) : (
                                <div className="w-8 h-8 shrink-0" />
                            )}

                            {/* Hoàn tác */}
                            {canUndo ? (
                                <Tooltip title="Hoàn tác duyệt" placement="top">
                                    <Button
                                        type="text"
                                        icon={<UndoOutlined />}
                                        onClick={() => setUndoModal({ isOpen: true, data: record })}
                                        className="flex items-center justify-center !w-8 !h-8 !text-amber-600 hover:!bg-amber-50"
                                    />
                                </Tooltip>
                            ) : (
                                <div className="w-8 h-8 shrink-0" />
                            )}

                            {/* Khóa / Mở khóa */}
                            {canBlock ? (
                                <Tooltip title="Khóa bài viết" placement="top">
                                    <Button
                                        type="text"
                                        icon={<StopOutlined />}
                                        onClick={() => setBlockModal({ isOpen: true, data: record })}
                                        className="flex items-center justify-center !w-8 !h-8 !text-rose-600 hover:!bg-rose-50"
                                    />
                                </Tooltip>
                            ) : canUnblock ? (
                                <Tooltip title="Mở khóa bài" placement="top">
                                    <Button
                                        type="text"
                                        icon={<UnlockOutlined />}
                                        onClick={() => setUnblockModal({ isOpen: true, data: record })}
                                        className="flex items-center justify-center !w-8 !h-8 !text-teal-600 hover:!bg-teal-50"
                                    />
                                </Tooltip>
                            ) : (
                                <div className="w-8 h-8 shrink-0" />
                            )}

                            {/* Xóa */}
                            <Tooltip title="Xóa tin đăng" placement="top">
                                <Button
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    onClick={() => setDeleteModal({ isOpen: true, id: record.id })}
                                    className="flex items-center justify-center !w-8 !h-8 !text-gray-600 hover:!bg-gray-100"
                                />
                            </Tooltip>
                        </Flex>
                    );
                }

                // Render dạng Dropdown
                const actions = [
                    {
                        key: 'view',
                        label: <span className="!text-blue-600 font-medium">Xem chi tiết</span>,
                        icon: <EyeOutlined className="!text-blue-600" />,
                        onClick: () => setDetailModal({ isOpen: true, id: record.id }),
                    },
                    ...(canApprove ? [{
                        key: 'approve',
                        label: <span className="!text-emerald-600 font-medium">Kiểm duyệt</span>,
                        icon: <CheckCircleOutlined className="!text-emerald-600" />,
                        onClick: () => setApprovalModal({ isOpen: true, data: record }),
                    }] : []),
                    ...(canUndo ? [{
                        key: 'undo',
                        label: <span className="!text-amber-600 font-medium">Hoàn tác duyệt</span>,
                        icon: <UndoOutlined className="!text-amber-600" />,
                        onClick: () => setUndoModal({ isOpen: true, data: record }),
                    }] : []),
                    ...(canBlock ? [{
                        key: 'block',
                        label: <span className="!text-rose-600 font-medium">Khóa bài viết</span>,
                        icon: <StopOutlined className="!text-rose-600" />,
                        onClick: () => setBlockModal({ isOpen: true, data: record }),
                    }] : []),
                    ...(canUnblock ? [{
                        key: 'unblock',
                        label: <span className="!text-teal-600 font-medium">Mở khóa bài</span>,
                        icon: <UnlockOutlined className="!text-teal-600" />,
                        onClick: () => setUnblockModal({ isOpen: true, data: record }),
                    }] : []),
                    {
                        key: 'delete',
                        label: <span className="!text-gray-600 font-medium">Xóa tin đăng</span>,
                        icon: <DeleteOutlined className="!text-gray-600" />,
                        onClick: () => setDeleteModal({ isOpen: true, id: record.id }),
                    },
                ];

                return <TableActionDropdown actions={actions} />;
            },
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
                    Quản lý, kiểm duyệt và theo dõi trạng thái các tin đăng trên hệ thống.
                </Text>
            </Flex>

            <div
                className="w-full flex flex-col rounded-lg shadow-sm overflow-hidden"
                style={{ backgroundColor: colorBgContainer, border: `1px solid ${colorBorderSecondary}` }}
            >
                <div
                    className="flex flex-wrap lg:flex-nowrap justify-between items-center gap-4 border-b px-4 py-4"
                    style={{ borderColor: colorBorderSecondary }}
                >
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto overflow-x-auto " style={{ scrollbarWidth: 'none' }}>
                        <Segmented
                            options={[
                                { label: 'Tất cả', value: 'ALL' },
                                ...MANAGE_POST_STATUS_OPTIONS
                            ]}
                            value={activeTab}
                            onChange={handleTabChange}
                        />

                        <FilterButton
                            activeCount={activeFilterCount}
                            onClick={() => setIsFilterModalOpen(true)}
                            onClear={handleResetFilters}
                        />

                        {isFilterChanged && (
                            <RefreshButton loading={isFetching} onClick={handleResetFilters} />
                        )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <Text type="secondary" className="text-[13px] hidden sm:block">Thao tác:</Text>
                        <Segmented
                            size="middle"
                            options={[
                                { value: 'dropdown', icon: <MenuOutlined /> },
                                { value: 'inline', icon: <AppstoreOutlined /> },
                            ]}
                            value={isInlineAction ? 'inline' : 'dropdown'}
                            onChange={(val) => setIsInlineAction(val === 'inline')}
                        />
                    </div>
                </div>

                <div className="w-full pt-2 px-4 pb-4">
                    <DataTable<Post>
                        columns={columns}
                        data={data?.content || []}
                        total={data?.totalElements || 0}
                        loading={isFetching}
                        tableState={{
                            currentPage: filters.page! + 1,
                            pageSize: filters.size!,
                            sortBy: filters.sortBy,
                            sortDirection: filters.sortDirection
                        }}
                        onChangeState={handleTableChange}
                        rowKey="id"
                        bordered={false}
                    />
                </div>
            </div>

            {/* MODALS */}
            <ManagePostFilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                filters={filters}
                onApply={handleApplyFilter}
            />

            <ManagePostDetailModal
                isOpen={detailModal.isOpen}
                postId={detailModal.id}
                onClose={() => setDetailModal({ isOpen: false, id: null })}
            />

            <PostApprovalModal
                isOpen={approvalModal.isOpen}
                post={approvalModal.data}
                onClose={() => setApprovalModal({ isOpen: false, data: null })}
            />

            <PostUndoApprovalModal
                isOpen={undoModal.isOpen}
                post={undoModal.data}
                onClose={() => setUndoModal({ isOpen: false, data: null })}
            />

            <PostBlockModal
                isOpen={blockModal.isOpen}
                post={blockModal.data}
                onClose={() => setBlockModal({ isOpen: false, data: null })}
            />

            <PostUnblockModal
                isOpen={unblockModal.isOpen}
                post={unblockModal.data}
                onClose={() => setUnblockModal({ isOpen: false, data: null })}
            />

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Xác nhận xóa tin đăng"
                content="Bạn có chắc chắn muốn xóa tin đăng này? Hành động này không thể hoàn tác và sẽ xóa hoàn toàn khỏi cơ sở dữ liệu."
                type="danger"
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                okText="Xóa ngay"
            />
        </div>
    );
}