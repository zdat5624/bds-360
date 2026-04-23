// @/features/transactions/components/transaction-filter.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { useAppTheme } from '@/hooks/use-app-theme';
import { toApiEndDate, toApiStartDate } from '@/utils';
import { DATE_FORMAT, dayjs } from '@/utils/date.util';
import { SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Flex, Form, Input, Select, Space, Switch, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { TransactionFilterParams } from '../api/types';
import { TRANSACTION_STATUS_OPTIONS, TRANSACTION_TYPE_OPTIONS } from '../transactions.constant';

const { Text } = Typography;
const { RangePicker } = DatePicker;

interface TransactionFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: TransactionFilterParams;
    onApply: (values: Partial<TransactionFilterParams>) => void;
}

export function TransactionFilterModal({ isOpen, onClose, filters, onApply }: TransactionFilterModalProps) {
    const { colorTextSecondary } = useAppTheme();
    const [form] = Form.useForm();
    const [searchField, setSearchField] = useState<'email' | 'transactionId' | 'txnId'>('email');
    const [isDateFilterEnabled, setIsDateFilterEnabled] = useState(true);

    useEffect(() => {
        if (isOpen) {
            let currentSearchField = 'email';
            let currentSearchValue = filters.email;

            if (filters.transactionId) {
                currentSearchField = 'transactionId';
                currentSearchValue = filters.transactionId.toString();
            } else if (filters.txnId) {
                currentSearchField = 'txnId';
                currentSearchValue = filters.txnId;
            }

            setSearchField(currentSearchField as any);
            const hasDate = !!filters.startDate;
            setIsDateFilterEnabled(hasDate);

            form.setFieldsValue({
                searchValue: currentSearchValue,
                status: filters.status || '',
                type: filters.type || '',
                isDateEnabled: hasDate,
                dateRange: hasDate
                    ? [dayjs(filters.startDate), dayjs(filters.endDate)]
                    : [dayjs().subtract(30, 'day'), dayjs()]
            });
        }
    }, [isOpen, filters, form]);

    const handleFinish = (values: any) => {
        const searchParams: any = { email: undefined, transactionId: undefined, txnId: undefined };
        if (values.searchValue) {
            searchParams[searchField] = values.searchValue;
        }

        const dateParams = values.isDateEnabled && values.dateRange ? {
            startDate: toApiStartDate(values.dateRange[0]),
            endDate: toApiEndDate(values.dateRange[1]),
        } : {
            startDate: undefined,
            endDate: undefined,
        };

        onApply({
            ...searchParams,
            status: values.status || undefined,
            type: values.type || undefined,
            ...dateParams,
        });
    };

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            title="Bộ lọc nâng cao"
            width={500}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item label={<span className="font-medium">Từ khóa tìm kiếm</span>} style={{ marginBottom: 16 }}>
                    <Space.Compact className="!w-full">
                        <Select
                            value={searchField}
                            onChange={setSearchField}
                            style={{ width: 140 }}
                            options={[
                                { label: 'Theo Email', value: 'email' },
                                { label: 'Mã Hệ Thống', value: 'transactionId' },
                                { label: 'Mã VNPAY', value: 'txnId' },
                            ]}
                        />
                        <Form.Item name="searchValue" noStyle>
                            <Input
                                placeholder="Nhập nội dung..."
                                prefix={<SearchOutlined style={{ color: colorTextSecondary }} />}
                            />
                        </Form.Item>
                    </Space.Compact>
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item name="type" label={<span className="font-medium">Loại giao dịch</span>} style={{ marginBottom: 16 }}>
                        <Select
                            options={[{ label: 'Tất cả loại', value: '' }, ...TRANSACTION_TYPE_OPTIONS]}
                        />
                    </Form.Item>

                    <Form.Item name="status" label={<span className="font-medium">Trạng thái</span>} style={{ marginBottom: 16 }}>
                        <Select
                            options={[{ label: 'Tất cả trạng thái', value: '' }, ...TRANSACTION_STATUS_OPTIONS]}
                        />
                    </Form.Item>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-2">
                    <Flex gap={12} align="center" className={isDateFilterEnabled ? "mb-3" : ""}>
                        <Form.Item name="isDateEnabled" valuePropName="checked" noStyle>
                            <Switch size="small" onChange={(checked) => setIsDateFilterEnabled(checked)} />
                        </Form.Item>
                        <Text strong>Lọc theo khoảng ngày</Text>
                    </Flex>

                    {isDateFilterEnabled && (
                        <Form.Item name="dateRange" style={{ marginBottom: 0 }}>
                            <RangePicker className="w-full" format={DATE_FORMAT.DEFAULT} allowClear={false} />
                        </Form.Item>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button onClick={onClose} className="px-6">Hủy</Button>
                    <Button type="primary" htmlType="submit" className="px-6">Áp dụng bộ lọc</Button>
                </div>
            </Form>
        </AppModal>
    );
}