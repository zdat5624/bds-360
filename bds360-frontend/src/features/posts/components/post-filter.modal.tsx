// @/features/posts/components/post-filter.modal.tsx
'use client';

import { FilterModal } from '@/components/composite';
import { LISTING_TYPE_OPTIONS } from '@/constants';
import { SearchOutlined, SwapOutlined } from '@ant-design/icons';
import { Col, Form, Input, InputNumber, Row, Select, Slider, Typography } from 'antd';
import { useEffect } from 'react';
import { PostFilterParams } from '../api/types';
import { LEGAL_STATUS_OPTIONS } from '../posts.constant';

const { Text } = Typography;

export interface PostFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (values: Partial<PostFilterParams>) => void;
    initialValues?: PostFilterParams;
}

// 🌟 Định nghĩa các tùy chọn tìm kiếm (Khớp với logic Backend)
const SEARCH_BY_OPTIONS = [
    { label: 'Mã tin (ID)', value: 'id' },
    { label: 'Tiêu đề', value: 'title' },
    { label: 'Mô tả nội dung', value: 'description' },
    { label: 'Email người đăng', value: 'email' },
];

export const PostFilterModal = ({
    isOpen,
    onClose,
    onApply,
    initialValues
}: PostFilterModalProps) => {
    const [form] = Form.useForm();
    const MAX_PRICE_SLIDER = 50000; // 50 Tỷ

    useEffect(() => {
        if (isOpen) {
            const min = initialValues?.minPrice ? initialValues.minPrice / 1_000_000 : 0;
            const max = initialValues?.maxPrice ? initialValues.maxPrice / 1_000_000 : MAX_PRICE_SLIDER;

            form.setFieldsValue({
                ...initialValues,
                // 🌟 Đảm bảo searchBy luôn có giá trị mặc định là ['id'] nếu chưa có
                searchBy: initialValues?.searchBy || ['id'],
                priceRange: [min, max]
            });
        }
    }, [isOpen, initialValues, form]);

    const handleInternalApply = () => {
        const values = form.getFieldsValue();
        const { priceRange, ...rest } = values;

        const transformedValues = {
            ...rest,
            minPrice: priceRange ? priceRange[0] * 1_000_000 : undefined,
            maxPrice: priceRange ? priceRange[1] * 1_000_000 : undefined,
        };

        onApply(transformedValues);
        onClose();
    };

    const handleInternalReset = () => {
        form.resetFields();
        form.setFieldsValue({
            priceRange: [0, MAX_PRICE_SLIDER],
            searchBy: ['id'] // 🌟 Reset về tìm theo ID mặc định
        });
    };

    return (
        <FilterModal
            title="Bộ lọc nâng cao"
            isOpen={isOpen}
            onClose={onClose}
            onApply={handleInternalApply}
            onReset={handleInternalReset}
            width={550}
        >
            <Form form={form} layout="vertical">
                {/* 🌟 Hàng 1: Từ khóa và Phạm vi tìm kiếm */}
                <Row gutter={12}>
                    <Col span={14}>
                        <Form.Item label="Từ khóa tìm kiếm" name="search">
                            <Input
                                prefix={<SearchOutlined className="text-gray-400" />}
                                placeholder="Nhập mã tin, tiêu đề..."
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item label="Tìm kiếm theo" name="searchBy">
                            <Select
                                mode="multiple"
                                maxTagCount="responsive"
                                placeholder="Chọn phạm vi"
                                options={SEARCH_BY_OPTIONS}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Hàng 2: Loại giao dịch và Pháp lý */}
                <Row gutter={12}>
                    <Col span={10}>
                        <Form.Item label="Loại giao dịch" name="type">
                            <Select placeholder="Tất cả" options={LISTING_TYPE_OPTIONS} allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={14}>
                        <Form.Item label="Tình trạng pháp lý" name="legalStatus">
                            <Select placeholder="Tất cả tình trạng" options={LEGAL_STATUS_OPTIONS} allowClear />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Hàng 3: Khoảng giá */}
                <div className="mt-2 px-2">
                    <Text className="mb-2 block font-medium">Khoảng giá (triệu đồng)</Text>
                    <div className="flex justify-between mt-1 px-1">
                        <Text className="text-[10px]" type="secondary">0 đ</Text>
                        <Text className="text-[10px]" type="secondary">50 Tỷ+</Text>
                    </div>
                    <Form.Item name="priceRange" noStyle>
                        <Slider
                            range
                            min={0}
                            max={MAX_PRICE_SLIDER}
                            step={10}
                            tooltip={{ formatter: (val) => `${val?.toLocaleString()} triệu` }}
                        />
                    </Form.Item>

                    <Form.Item noStyle shouldUpdate={(prev, cur) => prev.priceRange !== cur.priceRange}>
                        {({ getFieldValue, setFieldValue }) => {
                            const range = getFieldValue('priceRange') || [0, MAX_PRICE_SLIDER];
                            return (
                                <Row align="middle" wrap={false} className="mt-2">
                                    <Col flex="1">
                                        <InputNumber
                                            className="!w-full"
                                            min={0}
                                            value={range[0]}
                                            controls={false}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                            suffix="tr"
                                            onChange={(val) => setFieldValue('priceRange', [val || 0, range[1]])}
                                        />
                                    </Col>

                                    <Col flex="40px" className="flex justify-center">
                                        <SwapOutlined style={{ color: '#bfbfbf', fontSize: 16 }} />
                                    </Col>

                                    <Col flex="1">
                                        <InputNumber
                                            className="!w-full"
                                            min={range[0]}
                                            value={range[1]}
                                            controls={false}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                            suffix="tr"
                                            onChange={(val) => setFieldValue('priceRange', [range[0], val || MAX_PRICE_SLIDER])}
                                        />
                                    </Col>
                                </Row>
                            );
                        }}
                    </Form.Item>
                </div>
            </Form>
        </FilterModal>
    );
};