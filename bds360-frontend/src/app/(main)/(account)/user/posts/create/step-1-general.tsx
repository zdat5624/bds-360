// @/app/(main)/(account)/user/posts/create/step-1-general.tsx
'use client';

import { LISTING_TYPE_OPTIONS } from '@/constants';
import { useGetCategories } from '@/features/categories/api/categories.queries';
import { formatPostPrice } from '@/features/posts';
import { Col, Form, FormInstance, Input, InputNumber, Row, Select, Space, Typography } from 'antd';
import { useMemo } from 'react';

const { TextArea } = Input;
const { Text } = Typography;

interface Step1GeneralProps {
    form: FormInstance;
}

export function Step1General({ form }: Step1GeneralProps) {
    // 1. Lấy dữ liệu Categories từ Backend (Giả định bạn đã có hook này)
    const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategories({ page: 0, size: 100 });

    // 2. Lắng nghe sự thay đổi của trường 'type' (Bán / Thuê)
    const currentType = Form.useWatch('type', form);
    const currentPrice = Form.useWatch('price', form);

    // 3. Lọc danh mục theo Loại hình (Bán/Thuê)
    const filteredCategories = useMemo(() => {
        if (!categoriesData?.content) return [];
        // Nếu API trả về mảng category có thuộc tính 'type', ta sẽ lọc.
        // Còn nếu API trả về phẳng, bạn bỏ đoạn filter này đi.
        return categoriesData.content.filter((cat) => cat.type === (currentType || 'SALE'));
    }, [categoriesData, currentType]);

    // Xử lý khi đổi loại hình -> Xóa category đã chọn cũ
    const handleTypeChange = () => {
        form.setFieldValue('categoryId', undefined);
    };

    // Xử lý format ô nhập Giá tiền (Giống như logic cũ của bạn)
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Chỉ lấy số
        const value = e.target.value.replace(/\D/g, '');
        if (!value) {
            form.setFieldValue('price', undefined);
            return;
        }
        // Format hiển thị cho người dùng (ví dụ: 15.000.000)
        const formatted = new Intl.NumberFormat('vi-VN').format(Number(value));
        // form.setFieldValue('price', formatted);
    };

    return (
        <div className="flex flex-col gap-3 animate-fade-in">
            <div>
                <Text strong className="text-lg">1. Tổng quan bất động sản</Text>
                <Text type="secondary" className="block mt-1">
                    Hãy cung cấp những thông tin quan trọng nhất để khách hàng nắm bắt nhanh.
                </Text>
            </div>

            <Row gutter={24}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="Hình thức giao dịch"
                        name="type"
                        rules={[{ required: true, message: 'Vui lòng chọn hình thức' }]}
                    >
                        <Select
                            options={LISTING_TYPE_OPTIONS}
                            size="large"
                            onChange={handleTypeChange}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        label="Loại bất động sản"
                        name="categoryId"
                        rules={[{ required: true, message: 'Vui lòng chọn loại bất động sản' }]}
                    >
                        <Select
                            size="large"
                            placeholder="Chọn loại nhà đất"
                            loading={isLoadingCategories}
                            disabled={!currentType || isLoadingCategories}
                            options={filteredCategories.map(c => ({ label: c.name, value: c.id }))}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="Mức giá (VNĐ)"
                        required
                        rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                        extra={
                            currentPrice
                                ? (
                                    <span className="text-blue-600 font-medium">
                                        Hiển thị là: {formatPostPrice(
                                            Number(String(currentPrice).replace(/\D/g, '')),
                                            currentType
                                        )}
                                    </span>
                                )
                                : null
                        }
                    >

                        <Space.Compact className="!w-full">
                            {/* <InputNumber
                                className="!w-full"
                                size="large"
                                name="price"

                                formatter={(value) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                                }
                                parser={(value) => value!.replace(/\D/g, '')}
                                onKeyDown={(e) => {
                                    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                                    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                // onChange={(value) => form.setFieldValue('price', value)}
                                placeholder="VD: 3000000000"
                            /> */}
                            <Form.Item
                                name="price"
                                noStyle
                                rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                            >
                                <InputNumber
                                    className="!w-full"
                                    size="large"
                                    formatter={(value) =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                                    }
                                    parser={(value) => value!.replace(/\D/g, '')}
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                                        if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    placeholder="VD: 3000000000"
                                />
                            </Form.Item>

                            <span className="px-3 flex items-center border border-l-0 rounded-r-lg bg-gray-50 text-gray-500 font-medium">
                                VNĐ
                            </span>
                        </Space.Compact>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        label="Diện tích (m²)"
                        name="area"
                        rules={[
                            { required: true, message: 'Vui lòng nhập diện tích' },
                            {
                                validator: (_, value) =>
                                    value > 0 ? Promise.resolve() : Promise.reject('Diện tích phải lớn hơn 0'),
                            },
                        ]}
                    >
                        <Input
                            type="number"
                            size="large"
                            placeholder="VD: 50"
                            step="0.1"
                            min="0.1"
                            suffix="m²"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <div className="mt-0 ">
                <Text strong className="text-lg">2. Nội dung bài viết</Text>
                <Text type="secondary" className="block mt-1">
                    Một tiêu đề hấp dẫn và mô tả chi tiết sẽ giúp bất động sản của bạn thu hút nhiều sự chú ý hơn.
                </Text>
            </div>

            <Form.Item
                label="Tiêu đề tin đăng"
                name="title"
                rules={[
                    { required: true, message: 'Tiêu đề không được để trống' },
                    { min: 30, message: 'Tiêu đề nên có ít nhất 30 ký tự để thu hút người xem' },
                    { max: 255, message: 'Tiêu đề không được quá 255 ký tự' }
                ]}
            >
                <Input
                    size="large"
                    placeholder="VD: Bán nhà mặt phố Nguyễn Trãi, 50m2, 5 tầng, sổ đỏ chính chủ"
                    showCount
                    maxLength={255}
                />
            </Form.Item>

            <Form.Item
                label="Mô tả chi tiết"
                name="description"
                rules={[
                    { required: true, message: 'Vui lòng nhập mô tả' },
                    { min: 50, message: 'Mô tả cần ít nhất 50 ký tự' }
                ]}
            >
                <TextArea
                    rows={8}
                    placeholder="Giới thiệu về vị trí, tiện ích xung quanh, tình trạng nhà, giấy tờ pháp lý... Mô tả càng chi tiết càng dễ bán."
                    showCount
                    maxLength={3000}
                />
            </Form.Item>
        </div>
    );
}