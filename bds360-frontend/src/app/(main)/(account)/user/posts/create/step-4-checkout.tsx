'use client';

//  Import thêm VIP_COLOR_MAP từ file constant
import { VIP_COLOR_MAP } from '@/constants/vip-packages.constant';
import { useGetVips } from '@/features/vips/api/vips.queries';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatCurrency } from '@/utils';
import { Badge, Col, Form, FormInstance, InputNumber, Radio, Row, Skeleton, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
const { Text, Title } = Typography;

interface Step4CheckoutProps {
    form: FormInstance;
}

export function Step4Checkout({ form }: Step4CheckoutProps) {
    const { colorPrimary, colorError } = useAppTheme();
    const { data: vips, isLoading } = useGetVips();

    // Theo dõi sự thay đổi của Form để tính tiền
    const currentVipId = Form.useWatch('vipId', form);
    const currentDays = Form.useWatch('numberOfDays', form);
    const [totalCost, setTotalCost] = useState(0);

    // Tính tổng tiền mỗi khi Vip hoặc Số ngày thay đổi
    useEffect(() => {
        if (vips && currentVipId && currentDays) {
            const selectedVip = vips.find(v => v.id === currentVipId);
            if (selectedVip) {
                setTotalCost(selectedVip.pricePerDay * currentDays);
            } else {
                setTotalCost(0);
            }
        }
    }, [vips, currentVipId, currentDays]);

    // Mặc định chọn VIP tiêu chuẩn nếu chưa chọn
    useEffect(() => {
        if (vips && !currentVipId) {
            const defaultVip = vips.find(v => v.pricePerDay === 0) || vips[0];
            if (defaultVip) {
                form.setFieldValue('vipId', defaultVip.id);
            }
        }
    }, [vips, currentVipId, form]);

    if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;

    return (
        <div className="flex flex-col gap-4 animate-fade-in">
            <div>
                <Text strong className="text-lg">Gói tin & Thời gian hiển thị</Text>
                <Text type="secondary" className="block mt-1">
                    Chọn gói hiển thị phù hợp để tiếp cận nhiều khách hàng tiềm năng hơn.
                </Text>
            </div>

            <Row gutter={32}>
                {/* PHẦN CẤU HÌNH (TRÁI) */}
                <Col xs={24} md={14}>
                    <div className="mt-4">
                        <Text strong className="text-base block mb-2">
                            1. Chọn gói tin
                        </Text>

                        <Form.Item
                            name="vipId"
                            rules={[{ required: true, message: 'Vui lòng chọn gói tin' }]}
                            className="!mb-0"
                        >
                            <Radio.Group className="w-full">
                                {/*  Dùng thẻ Space của Ant Design để quản lý khoảng cách */}
                                <Space orientation="vertical" size="middle" className="w-full">
                                    {vips?.map((vip) => {
                                        const themeColor = VIP_COLOR_MAP[vip.id] || colorPrimary;
                                        const isSelected = currentVipId === vip.id;

                                        return (
                                            <label
                                                key={vip.id}
                                                // Xóa mb-1 đi
                                                className={`relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 w-full ${isSelected ? 'shadow-md' : 'hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                style={{
                                                    borderColor: isSelected ? themeColor : '#e5e7eb',
                                                    backgroundColor: isSelected ? `${themeColor}0A` : '#ffffff'
                                                }}
                                            >
                                                {/* Huy hiệu */}
                                                {isSelected && (
                                                    <div
                                                        className="absolute -top-3 right-4 px-2 py-0.5 rounded-full text-[10px] text-white font-bold uppercase tracking-wider shadow-sm"
                                                        style={{ backgroundColor: themeColor }}
                                                    >
                                                        Đang chọn
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-4">
                                                    <Radio value={vip.id} />
                                                    <div className="flex flex-col">
                                                        <Text strong style={{ color: isSelected ? themeColor : undefined, fontSize: 16 }}>
                                                            {vip.name}
                                                        </Text>
                                                        <Text type="secondary" className="text-sm mt-0.5">
                                                            {vip.pricePerDay === 0 ? 'Hiển thị cơ bản, miễn phí' : 'Hiển thị nổi bật, ưu tiên tìm kiếm'}
                                                        </Text>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <Text strong className="block text-base" style={{ color: isSelected ? themeColor : undefined }}>
                                                        {vip.pricePerDay === 0 ? 'Miễn phí' : formatCurrency(vip.pricePerDay)}
                                                    </Text>
                                                    {vip.pricePerDay > 0 && <Text type="secondary" className="text-xs">/ ngày</Text>}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                    </div>

                    <div className="!mt-6">
                        <Form.Item
                            label={<Text strong className="text-base">2. Số ngày đăng</Text>}
                            name="numberOfDays"
                            className="!mt-6 !w-full"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số ngày' },
                                { type: 'number', min: 1, max: 90, message: 'Số ngày từ 1 đến 90 ngày' }
                            ]}
                        >
                            <InputNumber
                                min={1}
                                max={90}
                                size="large"
                                className="!w-full"
                                addonAfter={<span className="font-medium text-gray-500">Ngày</span>}
                                placeholder="VD: 10"
                            />
                        </Form.Item>
                    </div>
                </Col>

                {/* PHẦN HÓA ĐƠN (PHẢI) */}
                <Col xs={24} md={10}>
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 sticky top-24 shadow-xl shadow-gray-100/50 mt-4 md:mt-10">
                        <Title level={4} className="!mb-6 !mt-0 text-center border-b pb-4">Tóm tắt thanh toán</Title>

                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <Text type="secondary">Gói tin đăng</Text>
                                <Badge
                                    color={VIP_COLOR_MAP[currentVipId] || '#d9d9d9'}
                                    text={<Text strong>{vips?.find(v => v.id === currentVipId)?.name || '---'}</Text>}
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <Text type="secondary">Đơn giá / ngày</Text>
                                <Text>{formatCurrency(vips?.find(v => v.id === currentVipId)?.pricePerDay || 0)}</Text>
                            </div>

                            <div className="flex justify-between items-center">
                                <Text type="secondary">Thời gian hiển thị</Text>
                                <Text>{currentDays || 0} ngày</Text>
                            </div>

                            {/* Đường gạch ngang nét đứt giống biên lai */}
                            <div className="border-b-2 border-dashed border-gray-200 my-2"></div>

                            <div className="flex justify-between items-end">
                                <Text className="text-base font-bold">Tổng thanh toán</Text>
                                <div className="text-right">
                                    <Text className="text-3xl font-extrabold" style={{ color: totalCost > 0 ? colorError : '#52c41a' }}>
                                        {totalCost === 0 ? 'Miễn phí' : formatCurrency(totalCost)}
                                    </Text>
                                </div>
                            </div>

                            {/* <div className="mt-4 bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-sm leading-relaxed">
                                <BulbOutlined /> Bằng việc nhấn <strong>"Xác nhận đăng tin"</strong>, hệ thống sẽ trừ số tiền tương ứng vào tài khoản của bạn và bài viết sẽ được đưa lên trạng thái chờ duyệt.
                            </div> */}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}