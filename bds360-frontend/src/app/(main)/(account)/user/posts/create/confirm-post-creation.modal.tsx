'use client';

import { ConfirmModal } from '@/components/base/confirm.modal';
import { VIP_COLOR_MAP } from '@/constants/vip-packages.constant';
import { Vip } from '@/features/vips';
import { formatCurrency } from '@/utils';
import { Descriptions, Divider, Typography } from 'antd';

const { Text } = Typography;

interface ConfirmPostCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    formData: any; // Dữ liệu từ form.getFieldsValue()
    vips: Vip[] | undefined;
}

export function ConfirmPostCreationModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    formData,
    vips
}: ConfirmPostCreationModalProps) {
    const selectedVip = vips?.find(v => v.id === formData.vipId);
    const totalCost = (selectedVip?.pricePerDay || 0) * (formData.numberOfDays || 0);

    const summaryContent = (
        <div className="mt-4">
            <Descriptions column={1} size="small" bordered={false}>
                <Descriptions.Item label="Tiêu đề">
                    <Text strong className="line-clamp-1">{formData.title}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Giá rao">
                    <Text className="text-blue-600 font-bold">{formData.price} (Tổng)</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Gói tin">
                    <Text style={{ color: VIP_COLOR_MAP[formData.vipId] || '#000' }} strong>
                        {selectedVip?.name}
                    </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Thời hạn">
                    {formData.numberOfDays} ngày
                </Descriptions.Item>
            </Descriptions>

            <Divider className="my-3" />

            <div className="flex justify-between items-center bg-red-50 p-3 rounded-lg">
                <Text strong>Tổng thanh toán:</Text>
                <Text strong className="text-xl text-red-600">
                    {totalCost === 0 ? 'Miễn phí' : formatCurrency(totalCost)}
                </Text>
            </div>
            <Text type="secondary" className="text-[12px] block mt-2 italic">
                * Lưu ý: Tiền sẽ được trừ trực tiếp vào tài khoản ngay sau khi xác nhận.
            </Text>
        </div>
    );

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            isLoading={isLoading}
            title="Xác nhận đăng tin bài?"
            content={summaryContent}
            okText="Xác nhận & Thanh toán"
            cancelText="Kiểm tra lại"
        />
    );
}