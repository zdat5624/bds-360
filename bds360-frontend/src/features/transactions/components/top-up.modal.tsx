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

    const currentAmount = Form.useWatch('amount', form);

    const handleFinish = async (values: CreatePaymentFormValues) => {
        const newTab = window.open('', '_blank');

        try {
            const data = await createPayment(values);

            if (data.paymentLink && newTab) {
                newTab.location.href = data.paymentLink;
                onClose();
            } else {
                newTab?.close();
            }
        } catch (error: unknown) { // 🌟 Thêm unknown ở đây cho chuẩn bài
            newTab?.close();
            console.error('TopUp failed:', error);
            message.error('Không thể tạo giao dịch. Vui lòng thử lại!');
        }
    };

    // 🌟 Đổi any thành unknown để chiều lòng ESLint
    const validateAmount = async (_: unknown, value: number) => {
        // Nếu giá trị trống, trả về resolve để rule 'required' bên ngoài xử lý
        if (value === null || value === undefined) {
            return Promise.resolve();
        }

        // Chỉ validate bằng Zod khi đã có con số cụ thể
        const result = createPaymentSchema.safeParse({ amount: value });
        if (!result.success) {
            // Lấy câu thông báo lỗi từ Zod (ví dụ: "Số tiền nạp tối thiểu...")
            throw new Error(result.error.issues[0].message);
        }

        return Promise.resolve();
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
                    // Dùng rules của Form để bắt lỗi trống (required)
                    rules={[{ required: true, message: 'Vui lòng nhập số tiền nạp' }, { validator: validateAmount }]}
                >
                    <InputNumber<number>
                        rootClassName="!w-full"
                        className="!w-full"
                        size="large"
                        placeholder="Nhập số tiền..."
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, ''))}

                        // 🚩 XÓA DÒNG NÀY: min={10000} 
                        // Nếu để min ở đây, Antd sẽ tự sửa giá trị null về 10000 ngay lập tức

                        step={10000}
                        disabled={isPending}
                        addonAfter={<span className="font-semibold text-[13px]">VNĐ</span>}
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
                                    className="!m-0 transition-all duration-200 rounded-md text-center"
                                    style={{
                                        height: '38px',
                                        lineHeight: '36px',
                                        display: 'block',
                                        border: `1px solid ${isSelected ? colorPrimary : colorBorder}`,
                                        background: isSelected ? colorPrimaryBg : colorBgContainer,
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