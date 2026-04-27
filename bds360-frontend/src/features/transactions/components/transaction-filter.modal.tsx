// @/features/transactions/components/transaction-filter.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { useAppTheme } from '@/hooks/use-app-theme';
import { toApiEndDate, toApiStartDate } from '@/utils';
import { DATE_FORMAT, dayjs } from '@/utils/date.util';
import { SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { TransactionFilterParams } from '../api/types';
import { TRANSACTION_STATUS_OPTIONS, TRANSACTION_TYPE_OPTIONS } from '../transactions.constant';

const { RangePicker } = DatePicker;

interface TransactionFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: TransactionFilterParams;
    onApply: (values: Partial<TransactionFilterParams>) => void;
}

type SearchField = 'email' | 'transactionId' | 'txnId';

interface FilterFormValues {
    searchValue?: string;
    status?: string;
    type?: string;
    dateRange?: [dayjs.Dayjs, dayjs.Dayjs] | null;
}

export function TransactionFilterModal({ isOpen, onClose, filters, onApply }: TransactionFilterModalProps) {
    const { colorTextSecondary } = useAppTheme();
    const [form] = Form.useForm();
    const [searchField, setSearchField] = useState<SearchField>('email');

    useEffect(() => {
        if (isOpen) {
            let currentSearchField: SearchField = 'email';
            let currentSearchValue: string | undefined = filters.email;

            if (filters.transactionId) {
                currentSearchField = 'transactionId';
                currentSearchValue = filters.transactionId.toString();
            } else if (filters.txnId) {
                currentSearchField = 'txnId';
                currentSearchValue = filters.txnId;
            }

            setSearchField(currentSearchField);

            form.setFieldsValue({
                searchValue: currentSearchValue,
                status: filters.status || '',
                type: filters.type || '',
                dateRange: filters.startDate && filters.endDate
                    ? [dayjs(filters.startDate), dayjs(filters.endDate)]
                    : null
            });
        }
    }, [isOpen, filters, form]);

    const handleFinish = (values: FilterFormValues) => {
        // 🌟 Khai báo object params chuẩn type của API
        const searchParams: Partial<TransactionFilterParams> = {
            email: undefined,
            transactionId: undefined,
            txnId: undefined
        };

        if (values.searchValue) {
            if (searchField === 'transactionId') {
                // Ép kiểu về number vì Backend yêu cầu số, UI trả về string
                searchParams.transactionId = Number(values.searchValue) || undefined;
            } else {
                // email và txnId vẫn là string
                searchParams[searchField] = values.searchValue;
            }
        }

        const dateParams = values.dateRange ? {
            startDate: toApiStartDate(values.dateRange[0]),
            endDate: toApiEndDate(values.dateRange[1]),
        } : {
            startDate: undefined,
            endDate: undefined,
        };

        onApply({
            ...searchParams,
            status: (values.status === '' ? undefined : values.status) as TransactionFilterParams['status'],
            type: (values.type === '' ? undefined : values.type) as TransactionFilterParams['type'],
            ...dateParams,
        });

        onClose();
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
                    <Form.Item label={<span className="font-medium">Lọc theo khoảng ngày</span>} name="dateRange" style={{ marginBottom: 0 }}>
                        <RangePicker className="w-full" format={DATE_FORMAT.DEFAULT} allowClear={true} />
                    </Form.Item>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button onClick={onClose} className="px-6">Hủy</Button>
                    <Button type="primary" htmlType="submit" className="px-6">Áp dụng bộ lọc</Button>
                </div>
            </Form>
        </AppModal>
    );
}