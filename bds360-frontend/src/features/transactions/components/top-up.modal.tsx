// @/features/transactions/components/top-up.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatCurrency } from '@/utils';
import { App, Button, Form, InputNumber, Tag } from 'antd';
import { useCreatePayment } from '../api/transactions.mutations';
import { CreatePaymentFormValues, createPaymentSchema } from '../transactions.schema';

interface TopUpModalProps {
    open: boolean;
    onClose: () => void;
}

const SUGGESTED_AMOUNTS = [50000, 100000, 200000, 500000, 1000000, 2000000];

export function TopUpModal({ open, onClose }: TopUpModalProps) {
    const {
        colorPrimary,
        colorTextSecondary,
        colorBorder,
        colorPrimaryBg,
        colorBgContainer,
        colorText
    } = useAppTheme();

    const { message } = App.useApp();
    const [form] = Form.useForm<CreatePaymentFormValues>();
    const { mutateAsync: createPayment, isPending } = useCreatePayment();

    // 👇 Theo dõi giá trị amount realtime để update UI của các Tag gợi ý
    const currentAmount = Form.useWatch('amount', form);

    const handleFinish = async (values: CreatePaymentFormValues) => {
        const newTab = window.open('', '_blank');

        try {
            const data = await createPayment(values);

            if (data.paymentLink && newTab) {
                newTab.location.href = data.paymentLink;

                // 👇 THÊM DÒNG NÀY ĐỂ ĐÓNG MODAL
                onClose();
            } else {
                // Đóng tab rỗng nếu không có link (đề phòng API trả về lỗi nhưng không nhảy vào catch)
                newTab?.close();
            }
        } catch (error) {
            newTab?.close();
            console.error('TopUp failed:', error);
            message.error('Không thể tạo giao dịch. Vui lòng thử lại!'); // Thêm thông báo cho xịn
        }
    };

    const validateAmount = async (_: any, value: number) => {
        const result = createPaymentSchema.safeParse({ amount: value });
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }
    };

    return (
        <AppModal
            title="Nạp tiền vào tài khoản"
            isOpen={open}
            onClose={onClose}
            isLoading={isPending}
            width={420}
            styles={{ body: { paddingBottom: 0 } }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{ amount: 100000 }}
                className="!mb-0 !p-0"
            >
                <Form.Item
                    name="amount"
                    label={<span className="font-medium">Số tiền cần nạp</span>}
                    rules={[{ validator: validateAmount }]}
                >
                    <InputNumber<number>
                        rootClassName="!w-full" // Ép cái vỏ bọc chứa addon bung 100%
                        className="!w-full"     // Ép cái lõi input bên trong bung 100%
                        size="large"
                        placeholder="Nhập số tiền..."
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, ''))}
                        min={10000}
                        step={10000}
                        disabled={isPending}
                        addonAfter={
                            <span className="font-semibold text-[13px]" style={{ color: colorTextSecondary }}>
                                VNĐ
                            </span>
                        }
                    />
                </Form.Item>

                <div className="mb-8 flex flex-col gap-2.5">
                    <span className="text-[13px]" style={{ color: colorTextSecondary }}>
                        Gợi ý nạp nhanh:
                    </span>

                    <div className="grid grid-cols-3 gap-2.5">
                        {SUGGESTED_AMOUNTS.map((amount) => {
                            const isSelected = currentAmount === amount;
                            return (
                                <Tag.CheckableTag
                                    key={amount}
                                    checked={isSelected}
                                    onChange={() => form.setFieldsValue({ amount })}
                                    // 👇 FIX 2: Bỏ flex, dùng text-center kết hợp display block
                                    className="!m-0 transition-all duration-200 rounded-md text-center"
                                    style={{
                                        height: '38px',
                                        // 👇 FIX 2: Dùng lineHeight bằng (height - 2px viền) để căn giữa dọc tuyệt đối
                                        lineHeight: '36px',
                                        display: 'block', // Ép full width của grid column

                                        // Màu nền và viền
                                        border: `1px solid ${isSelected ? colorPrimary : colorBorder}`,
                                        background: isSelected ? colorPrimaryBg : colorBgContainer,

                                        // 👇 FIX 1: Ép lại màu chữ. Nếu đang chọn thì dùng màu Primary (xanh đậm), bình thường thì dùng màu Text chuẩn
                                        color: isSelected ? colorPrimary : colorText,

                                        fontSize: '13.5px',
                                        fontWeight: isSelected ? 600 : 400,
                                    }}
                                >
                                    {formatCurrency(amount).replace(' ₫', '')}
                                </Tag.CheckableTag>
                            );
                        })}
                    </div>
                </div>

                <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={isPending}
                        className="font-medium"
                    >
                        {isPending ? 'Đang tạo giao dịch...' : 'Xác nhận nạp tiền'}
                    </Button>
                </Form.Item>
            </Form>
        </AppModal>
    );
}