// @/app/(main)/(account)/user/posts/page.tsx
'use client';

import { DataTable, FilterButton, TableState } from '@/components/base';
import { TableActionDropdown } from '@/components/composite';
import { APP_ROUTES } from '@/config/routes';
import { useAppTheme } from '@/hooks/use-app-theme';
import { DATE_FORMAT, getSmartRelativeTime } from '@/utils';
import {
    ArrowUpOutlined, // 🌟 Import icon Đẩy tin
    CalendarOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeInvisibleOutlined,
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
    BumpPostModal,
    DeletePostModal,
    formatPostPrice,
    getFullAddress,
    Post,
    PostDetailModal,
    PostFilterModal,
    PostFilterParams,
    RenewPostModal,
    TogglePostVisibilityModal,
    useGetPosts
} from '@/features/posts';

import { VIP_TAG_COLOR_MAP } from '@/constants';
import {
    POST_STATUS_COLOR,
    POST_STATUS_LABEL,
    PostStatus,
    USER_POST_STATUS_DISPLAY,
    USER_POST_STATUS_OPTIONS,
} from '@/features/posts/posts.constant';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function UserPostsPage() {
    const { colorError, colorText, colorBorderSecondary } = useAppTheme();
    const router = useRouter();

    // --- STATE BỘ LỌC ---
    const [filters, setFilters] = useState<PostFilterParams>({
        page: 0,
        size: 10,
        sortBy: 'pushedAt',
        sortDirection: 'DESC',
        statuses: undefined,
    });

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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

    const [visibilityModal, setVisibilityModal] = useState<{ isOpen: boolean; post: Post | null }>({
        isOpen: false,
        post: null,
    });

    // 🌟 STATE CHO TÍNH NĂNG BUMP VÀ RENEW
    const [bumpModal, setBumpModal] = useState<{ isOpen: boolean; post: Post | null }>({
        isOpen: false,
        post: null,
    });
    const [renewModal, setRenewModal] = useState<{ isOpen: boolean; post: Post | null }>({
        isOpen: false,
        post: null,
    });

    // --- DATA FETCHING ---
    const { data, isFetching } = useGetPosts('my', filters);

    // --- HANDLERS ---
    const handleTableStateChange = (newState: TableState) => {
        setFilters((prev) => ({
            ...prev,
            page: newState.currentPage - 1,
            size: newState.pageSize,
            sortBy: newState.sortBy || 'pushedAt',
            sortDirection: newState.sortDirection || 'DESC',
        }));
    };

    const handleTabChange = (key: string) => {
        let statuses: PostStatus[] | undefined = undefined;
        if (key !== 'ALL') {
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
            sortBy: 'pushedAt',
            sortDirection: 'DESC',
            statuses: filters.statuses,
        });
    };

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
            width: 80,
            align: 'center',
            sorter: true,
            render: (id: number) => (
                <Link href={APP_ROUTES.PUBLIC.POST_DETAIL(id)} target="_blank" className="text-blue-600 hover:underline font-mono">
                    {id}
                </Link>
            ),
        },
        {
            title: 'Thông tin bài đăng',
            dataIndex: 'title',
            key: 'title',
            width: '35%',
            render: (title: string, record: Post) => {
                const vipColor = VIP_TAG_COLOR_MAP[record.vip?.id];
                const isVip = record.vip?.vipLevel > 0;

                return (
                    <div className="flex flex-col gap-0.5" style={{ maxWidth: '100%' }}>
                        {/* --- DÒNG 1: TIÊU ĐỀ & TAGS --- */}
                        <div className="flex items-center gap-1.5 w-full">
                            {/* flex-1 và min-w-0 ép Text phải co lại và hiện dấu ... nếu quá dài */}
                            <Text
                                strong
                                className="text-[14px] flex-1 min-w-0"
                                ellipsis={{ tooltip: title }}
                            >
                                {title}
                            </Text>

                            {/* shrink-0 đảm bảo các Tag luôn giữ nguyên kích thước, không bị ép bẹp */}
                            <div className="flex items-center gap-1 shrink-0">
                                {isVip && (
                                    <Tag
                                        color={vipColor}
                                        className="m-0 border-none px-1.5 py-0 text-[10px] font-bold uppercase leading-5 shadow-sm"
                                    >
                                        {record.vip.name}
                                    </Tag>
                                )}

                                {record.isHidden && (
                                    <Tag
                                        color="default"
                                        icon={<EyeInvisibleOutlined />}
                                        className="m-0 text-[10px] leading-4 px-1"
                                    >
                                        Ẩn
                                    </Tag>
                                )}
                            </div>
                        </div>

                        {/* --- DÒNG 2: ĐỊA CHỈ --- */}
                        <Text
                            type="secondary"
                            className="text-[12px] opacity-70 w-full"
                            ellipsis={{ tooltip: getFullAddress(record) }}
                        >
                            {getFullAddress(record)}
                        </Text>
                    </div>
                );
            },
        },
        {
            title: 'Diện tích',
            dataIndex: 'area',
            key: 'area',
            width: 100,
            align: 'right',
            sorter: true,
            render: (area: number) => <Text>{area} m²</Text>,
        },
        {
            title: 'Mức giá',
            dataIndex: 'price',
            key: 'price',
            align: 'right',
            width: 140,
            sorter: true,
            render: (price: number, record: Post) => (
                <div className="flex flex-col items-end">
                    <Text strong style={{ color: colorError }}>{formatPostPrice(price, record.type)}</Text>
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: 130,
            render: (status: PostStatus) => {
                const displayKey = USER_POST_STATUS_DISPLAY[status];
                return (
                    <Tag color={POST_STATUS_COLOR[displayKey]} variant="filled">
                        {POST_STATUS_LABEL[displayKey]}
                    </Tag>
                );
            },
        },
        {
            title: 'Đẩy tin lúc',
            dataIndex: 'pushedAt',
            key: 'pushedAt',
            align: 'right',
            width: 150,
            sorter: true,
            render: (_, record) => getSmartRelativeTime(record.pushedAt, DATE_FORMAT.FULL_TIME),
        },
        {
            title: '',
            key: 'action',
            width: 50,
            align: 'center',
            fixed: 'right',
            render: (_, record) => {
                // Định nghĩa các cờ (flags) disabled để tái sử dụng
                const isBumpDisabled = record.status !== 'APPROVED' && record.status !== 'REVIEW_LATER';
                const isRenewDisabled = record.status === 'BLOCKED';
                const isEditOrToggleDisabled = record.status === 'BLOCKED' || record.status === 'EXPIRED';

                return (
                    <TableActionDropdown actions={[
                        {
                            key: 'view_detail',
                            label: 'Xem chi tiết',
                            icon: <EyeOutlined />,
                            color: '#2563eb', // blue-600
                            onClick: () => setDetailModal({ isOpen: true, postId: record.id }),
                        },
                        // 🌟 NÚT ĐẨY TIN: Màu Cam/Vàng nổi bật (chỉ khi không bị disable)
                        {
                            key: 'bump_post',
                            label: 'Đẩy lên đầu trang',
                            icon: <ArrowUpOutlined />,
                            color: isBumpDisabled ? undefined : '#f59e0b', // amber-500
                            disabled: isBumpDisabled,
                            onClick: () => setBumpModal({ isOpen: true, post: record }),
                        },
                        // 🌟 NÚT GIA HẠN: Màu Xanh ngọc (chỉ khi không bị disable)
                        {
                            key: 'renew_post',
                            label: 'Gia hạn tin',
                            icon: <CalendarOutlined />,
                            color: isRenewDisabled ? undefined : '#10b981', // emerald-500
                            disabled: isRenewDisabled,
                            onClick: () => setRenewModal({ isOpen: true, post: record }),
                        },
                        {
                            key: 'toggle_visibility',
                            // Nếu đang disable thì bọc span lại để bỏ màu xanh/cam đi, trở về text mặc định để Antd tự làm xám
                            label: isEditOrToggleDisabled ? (
                                <span>{record.isHidden ? 'Hiển thị tin' : 'Tạm ẩn tin'}</span>
                            ) : (
                                record.isHidden
                                    ? <span className="!text-emerald-600 font-medium">Hiển thị tin</span>
                                    : <span className="!text-amber-500 font-medium">Tạm ẩn tin</span>
                            ),

                            icon: isEditOrToggleDisabled ? (
                                record.isHidden ? <EyeOutlined /> : <EyeInvisibleOutlined />
                            ) : (
                                record.isHidden
                                    ? <EyeOutlined className="!text-emerald-600" />
                                    : <EyeInvisibleOutlined className="!text-amber-500" />
                            ),

                            disabled: isEditOrToggleDisabled,
                            onClick: () => setVisibilityModal({ isOpen: true, post: record }),
                        },
                        {
                            key: 'edit_post',
                            label: 'Chỉnh sửa',
                            icon: <EditOutlined />,
                            disabled: isEditOrToggleDisabled,
                            onClick: () => router.push(APP_ROUTES.USER.EDIT_POST(record.id)),
                        },
                        {
                            key: 'delete_post',
                            label: 'Xóa tin',
                            icon: <DeleteOutlined />,
                            danger: true, // Danger tự động handle màu đỏ & mờ xám khi disable bởi hệ thống Antd
                            onClick: () => setDeleteModal({ isOpen: true, post: record }),
                        },
                    ]} />
                );
            },
        },
    ];

    return (
        <div className="w-full flex flex-col gap-4">
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
                        ...USER_POST_STATUS_OPTIONS.map((o: any) => ({ key: o.value, label: o.label }))
                    ]}
                />
            </div>

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
                scroll={{ x: 800 }}
            />

            {/* --- MODALS --- */}
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

            <TogglePostVisibilityModal
                isOpen={visibilityModal.isOpen}
                post={visibilityModal.post}
                onClose={() => setVisibilityModal({ isOpen: false, post: null })}
            />

            {/* 🌟 NHÚNG MODAL ĐẨY VÀ GIA HẠN */}
            <BumpPostModal
                isOpen={bumpModal.isOpen}
                post={bumpModal.post}
                onClose={() => setBumpModal({ isOpen: false, post: null })}
            />

            <RenewPostModal
                isOpen={renewModal.isOpen}
                post={renewModal.post}
                onClose={() => setRenewModal({ isOpen: false, post: null })}
            />
        </div>
    );
}