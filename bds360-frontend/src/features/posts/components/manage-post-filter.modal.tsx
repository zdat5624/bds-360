// @/features/posts/components/manage-post-filter.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { LISTING_TYPE_OPTIONS, VIP_PACKAGES } from '@/constants';
import { useGetCategories } from '@/features/categories';
import { MANAGE_POST_STATUS_OPTIONS } from '@/features/posts';
import { SearchOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, InputNumber, Select, Switch, Typography } from 'antd';
import { useEffect } from 'react';
import { PostFilterParams } from '../api/types';

const { Text } = Typography;

interface ManagePostFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: PostFilterParams;
    onApply: (values: Partial<PostFilterParams>) => void;
}

export function ManagePostFilterModal({ isOpen, onClose, filters, onApply }: ManagePostFilterModalProps) {
    const [form] = Form.useForm();
    const { message } = App.useApp();

    // Theo dõi giá trị của field 'type' (Loại giao dịch) để xử lý logic khóa/mở Danh mục
    const selectedType = Form.useWatch('type', form);

    // Fetch danh mục dựa theo 'type' đã chọn. Nếu chưa chọn type thì không fetch.
    const { data: categoryData, isFetching: isLoadingCategories } = useGetCategories(
        { page: 0, size: 100, type: selectedType || undefined },
        false,
        {
            enabled: isOpen && !!selectedType, // Chỉ fetch khi mở Modal VÀ đã chọn type
        }
    );

    useEffect(() => {
        if (isOpen) {
            form.setFieldsValue({
                search: filters.search || '', // Thêm search vào form
                type: filters.type || '',
                vipId: filters.vipId !== undefined ? filters.vipId : '',
                categoryId: filters.categoryId || '',
                statuses: filters.statuses?.[0] || '',
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                minArea: filters.minArea,
                maxArea: filters.maxArea,
                isDeleteByUser: filters.isDeleteByUser || false,
            });
        }
    }, [isOpen, filters, form]);

    // Khi người dùng thay đổi Loại giao dịch, tự động xóa Danh mục đã chọn trước đó
    const handleTypeChange = (value: string) => {
        form.setFieldValue('categoryId', '');
        if (!value) {
            message.info('Vui lòng chọn Loại giao dịch để xem Danh mục tương ứng');
        }
    };

    const handleFinish = (values: any) => {
        onApply({
            search: values.search?.trim() || undefined, // Áp dụng search
            type: values.type || undefined,
            vipId: values.vipId !== '' ? values.vipId : undefined,
            categoryId: values.categoryId !== '' ? values.categoryId : undefined,
            statuses: values.statuses !== '' ? [values.statuses] : undefined,
            minPrice: values.minPrice || undefined,
            maxPrice: values.maxPrice || undefined,
            minArea: values.minArea || undefined,
            maxArea: values.maxArea || undefined,
            isDeleteByUser: values.isDeleteByUser ? true : undefined,
            page: 0,
        });
        onClose();
    };

    const handleClear = () => {
        form.setFieldsValue({
            search: '',
            type: '',
            vipId: '',
            categoryId: '',
            statuses: '',
            minPrice: undefined,
            maxPrice: undefined,
            minArea: undefined,
            maxArea: undefined,
            isDeleteByUser: false,
        });
    };

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            title="Bộ lọc nâng cao"
            width={600}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                {/* Trường Tìm kiếm */}
                <Form.Item name="search" label={<span className="font-medium">Từ khóa tìm kiếm</span>} className="!mb-4">
                    <Input
                        placeholder="Tìm theo tiêu đề, email, tên người đăng..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        allowClear
                    />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item name="type" label={<span className="font-medium">Loại giao dịch</span>} className="!mb-4">
                        <Select
                            options={[{ label: 'Tất cả loại', value: '' }, ...LISTING_TYPE_OPTIONS]}
                            onChange={handleTypeChange}
                        />
                    </Form.Item>

                    <Form.Item name="statuses" label={<span className="font-medium">Trạng thái</span>} className="!mb-4">
                        <Select options={[{ label: 'Tất cả trạng thái', value: '' }, ...MANAGE_POST_STATUS_OPTIONS]} />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="categoryId"
                        label={<span className="font-medium">Danh mục BĐS</span>}
                        className="!mb-4"
                        tooltip="Bạn cần chọn Loại giao dịch trước khi chọn Danh mục"
                    >
                        <Select
                            disabled={!selectedType}
                            loading={isLoadingCategories}
                            showSearch
                            optionFilterProp="label"
                            placeholder={!selectedType ? "Vui lòng chọn Loại giao dịch trước" : "Chọn danh mục"}
                            options={[
                                { label: 'Tất cả danh mục', value: '' },
                                ...(categoryData?.content || []).map(cat => ({ label: cat.name, value: cat.id }))
                            ]}
                        />
                    </Form.Item>

                    <Form.Item name="vipId" label={<span className="font-medium">Gói hiển thị (VIP)</span>} className="!mb-4">
                        <Select
                            options={[
                                { label: 'Tất cả gói', value: '' },
                                ...VIP_PACKAGES.map(v => ({ label: v.shortName, value: v.id }))
                            ]}
                        />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-0">
                    <Form.Item label={<span className="font-medium">Khoảng giá (VNĐ)</span>} className="!mb-4 col-span-2">
                        <div className="flex items-center gap-2">
                            <Form.Item name="minPrice" noStyle>
                                <InputNumber
                                    className="!w-full"
                                    placeholder="Từ"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                                    min={0}
                                />
                            </Form.Item>
                            <span className="text-gray-400">-</span>
                            <Form.Item name="maxPrice" noStyle>
                                <InputNumber
                                    className="!w-full"
                                    placeholder="Đến"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                                    min={0}
                                />
                            </Form.Item>
                        </div>
                    </Form.Item>

                    <Form.Item label={<span className="font-medium">Khoảng diện tích (m²)</span>} className="!mb-4 col-span-2">
                        <div className="flex items-center gap-2">
                            <Form.Item name="minArea" noStyle>
                                <InputNumber className="!w-full" placeholder="Từ" min={0} />
                            </Form.Item>
                            <span className="text-gray-400">-</span>
                            <Form.Item name="maxArea" noStyle>
                                <InputNumber className="!w-full" placeholder="Đến" min={0} />
                            </Form.Item>
                        </div>
                    </Form.Item>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mt-2">
                    <div className="flex items-center justify-between">
                        <Text strong>Tin đăng đã bị người dùng xóa</Text>
                        <Form.Item name="isDeleteByUser" valuePropName="checked" className="!mb-0">
                            <Switch size="small" />
                        </Form.Item>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <Button onClick={handleClear} type="text" className="text-gray-500">Xóa bộ lọc</Button>
                    <div className="flex gap-2">
                        <Button onClick={onClose} className="px-6">Hủy</Button>
                        <Button type="primary" htmlType="submit" className="px-6">Áp dụng</Button>
                    </div>
                </div>
            </Form>
        </AppModal>
    );
}