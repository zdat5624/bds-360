'use client';

import { useGetDistricts, useGetProvinces, useGetWards } from '@/features/addresses';
import { MapSelector } from '@/features/posts';
import customFetch from '@/lib/custom-fetch';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Col, Form, FormInstance, Input, Row, Select, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';

const { Text } = Typography;

interface Step2LocationProps {
    form: FormInstance;
}

export function Step2Location({ form }: Step2LocationProps) {
    const provinceCode = Form.useWatch('provinceCode', form);
    const districtCode = Form.useWatch('districtCode', form);
    const wardCode = Form.useWatch('wardCode', form);
    const streetAddress = Form.useWatch('streetAddress', form);

    const [fullAddress, setFullAddress] = useState('');

    //  FIX 1: Lấy trực tiếp tọa độ từ form ngay lúc khởi tạo (Không đợi useEffect)
    const initialLat = form.getFieldValue('latitude');
    const initialLng = form.getFieldValue('longitude');

    const [coordinates, setCoordinates] = useState({
        latitude: initialLat || 10.775844,
        longitude: initialLng || 106.701756
    });

    //  FIX 2: Nếu form đã có tọa độ (Edit mode), tự động khóa Geocode
    const [isUserModified, setIsUserModified] = useState(!!initialLat);

    const { data: provinces, isLoading: isLoadingProvinces } = useGetProvinces();
    const { data: districts, isLoading: isLoadingDistricts } = useGetDistricts(provinceCode);
    const { data: wards, isLoading: isLoadingWards } = useGetWards(districtCode);

    const handleProvinceChange = () => {
        form.setFieldsValue({ districtCode: undefined, wardCode: undefined });
        setIsUserModified(false);
    };

    const handleDistrictChange = () => {
        form.setFieldsValue({ wardCode: undefined });
        setIsUserModified(false);
    };

    const handleWardChange = () => {
        // Giữ nguyên vị trí A nếu user đã ghim tay
    };

    const handleMapChange = (coords: { latitude: number; longitude: number }) => {
        setCoordinates(coords);
        form.setFieldsValue({ latitude: coords.latitude, longitude: coords.longitude });
        setIsUserModified(true);
    };

    // Geocoding Effect (Tự động nhảy map khi nhập địa chỉ)
    useEffect(() => {
        if (!provinces) return;

        const pName = provinces.find((p) => p.code === provinceCode)?.name || '';
        const dName = districts?.find((d) => d.code === districtCode)?.name || '';
        const wName = wards?.find((w) => w.code === wardCode)?.name || '';

        const addressString = [wName, dName, pName].filter(Boolean).join(', ');
        setFullAddress([streetAddress || '', addressString].filter(Boolean).join(', '));

        if (addressString && !isUserModified) {
            const fetchCoords = async () => {
                try {
                    const res: any = await customFetch.get('/addresses/geocode', { params: { address: addressString } });
                    if (res?.latitude && res?.longitude) {
                        setCoordinates({ latitude: res.latitude, longitude: res.longitude });
                        form.setFieldsValue({ latitude: res.latitude, longitude: res.longitude });
                    }
                } catch (error) {
                    console.error('Geocode failed');
                }
            };
            fetchCoords();
        }
    }, [provinceCode, districtCode, wardCode, streetAddress, provinces, districts, wards, isUserModified, form]);

    return (
        <div className="flex flex-col gap-2 animate-fade-in">
            <div>
                <Text strong className="text-lg">Vị trí bất động sản</Text>
                <Text type="secondary" className="block mt-1">
                    Cung cấp địa chỉ chính xác giúp tin đăng của bạn thu hút đúng khách hàng mục tiêu.
                </Text>
            </div>

            <Row gutter={16}>
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Tỉnh/Thành phố"
                        name="provinceCode"
                        rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố' }]}
                    >
                        <Select
                            placeholder="-- Chọn Tỉnh/Thành --"
                            size="large"
                            loading={isLoadingProvinces}
                            options={provinces?.map((p) => ({ label: p.name, value: p.code }))}
                            onChange={handleProvinceChange}
                            showSearch
                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                    <Form.Item
                        label="Quận/Huyện"
                        name="districtCode"
                        rules={[{ required: true, message: 'Vui lòng chọn Quận/Huyện' }]}
                    >
                        <Select
                            placeholder="-- Chọn Quận/Huyện --"
                            size="large"
                            loading={isLoadingDistricts}
                            disabled={!provinceCode || isLoadingDistricts}
                            options={districts?.map((d) => ({ label: d.name, value: d.code }))}
                            onChange={handleDistrictChange}
                            showSearch
                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                    <Form.Item
                        label="Phường/Xã"
                        name="wardCode"
                    >
                        <Select
                            placeholder="-- Chọn Phường/Xã --"
                            size="large"
                            loading={isLoadingWards}
                            disabled={!districtCode || isLoadingWards}
                            options={wards?.map((w) => ({ label: w.name, value: w.code }))}
                            onChange={handleWardChange}
                            showSearch
                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label="Địa chỉ chi tiết (Số nhà, Đường/Phố)"
                name="streetAddress"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết' }]}
            >
                <Input size="large" placeholder="Nhập số nhà, hẻm, đường phố..." />
            </Form.Item>

            {/* Preview hiển thị địa chỉ & Tọa độ */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* TRÁI: ĐỊA CHỈ */}
                {/* TRÁI: ĐỊA CHỈ */}
                <div className="flex-1 min-w-0">
                    <Text type="secondary" className="text-[11px] uppercase tracking-wider font-bold block">
                        Địa chỉ hiển thị trên tin đăng:
                    </Text>
                    <div className="mt-1 font-medium text-blue-900 flex items-start gap-2">
                        <EnvironmentOutlined className="text-blue-500 mt-[4px] shrink-0" />
                        <span className="break-words min-w-0 flex-1">
                            {fullAddress || 'Chưa có thông tin địa chỉ'}
                        </span>
                    </div>
                </div>

                {/* PHẢI: TỌA ĐỘ */}
                <div className="flex flex-wrap items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l md:pl-4 border-blue-200 border-dashed shrink-0">
                    <div>
                        <Text type="secondary" className="text-[10px] block mb-1">VĨ ĐỘ (LATITUDE)</Text>
                        <Tag color="blue" className="font-mono text-sm m-0 px-3">
                            {coordinates.latitude.toFixed(6)}
                        </Tag>
                    </div>
                    <div>
                        <Text type="secondary" className="text-[10px] block mb-1">KINH ĐỘ (LONGITUDE)</Text>
                        <Tag color="cyan" className="font-mono text-sm m-0 px-3">
                            {coordinates.longitude.toFixed(6)}
                        </Tag>
                    </div>
                    <div>
                        <Text type="secondary" className="text-[10px] block mb-1">TRẠNG THÁI</Text>
                        {isUserModified ? (
                            <Tag color="orange" className="m-0 uppercase text-[10px]">Đã ghim tay</Tag>
                        ) : (
                            <Tag color="green" className="m-0 uppercase text-[10px]">Tự động (Geocode)</Tag>
                        )}
                    </div>
                </div>

            </div>

            <div className="mt-2">
                <Text strong className="block mb-3">
                    Ghim vị trí trên bản đồ
                    <Text type="secondary" className="font-normal ml-2">
                        (Kéo thả bản đồ để định vị chính xác vị trí)
                    </Text>
                </Text>

                <Form.Item name="latitude" hidden><Input /></Form.Item>
                <Form.Item name="longitude" hidden><Input /></Form.Item>

                <MapSelector
                    latitude={coordinates.latitude}
                    longitude={coordinates.longitude}
                    onChange={handleMapChange}
                    isUserModified={isUserModified}
                    setIsUserModified={setIsUserModified}
                />
            </div>
        </div>
    );
}