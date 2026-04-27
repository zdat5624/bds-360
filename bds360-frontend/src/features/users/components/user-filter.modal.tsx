// @/features/users/components/user-filter.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { GENDER_OPTIONS, USER_ROLE_OPTIONS } from '@/constants';
import { useAppTheme } from '@/hooks/use-app-theme';
import { toApiEndDate, toApiStartDate } from '@/utils';
import { DATE_FORMAT, dayjs } from '@/utils/date.util';
import { SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { UserFilterParams } from '../api/types';

const { RangePicker } = DatePicker;

interface UserFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: UserFilterParams;
    onApply: (values: Partial<UserFilterParams>) => void;
}
interface FilterFormValues {
    searchValue?: string;
    role?: string;
    gender?: string;
    dateRange?: [dayjs.Dayjs, dayjs.Dayjs] | null;
}

type SearchField = 'name' | 'email' | 'phone';

export function UserFilterModal({ isOpen, onClose, filters, onApply }: UserFilterModalProps) {
    const { colorTextSecondary } = useAppTheme();
    const [form] = Form.useForm();
    const [searchField, setSearchField] = useState<SearchField>('name');

    useEffect(() => {
        if (isOpen) {
            let currentSearchField = 'name';
            let currentSearchValue = filters.name;

            if (filters.email) {
                currentSearchField = 'email';
                currentSearchValue = filters.email;
            } else if (filters.phone) {
                currentSearchField = 'phone';
                currentSearchValue = filters.phone;
            }

            setSearchField(currentSearchField as SearchField);

            form.setFieldsValue({
                searchValue: currentSearchValue,
                role: filters.role || 'ALL',
                gender: filters.gender || '',
                dateRange: filters.createdFrom && filters.createdTo
                    ? [dayjs(filters.createdFrom), dayjs(filters.createdTo)]
                    : null
            });
        }
    }, [isOpen, filters, form]);

    // const handleFinish = (values: any) => {
    //     const searchParams: any = { name: undefined, email: undefined, phone: undefined };
    //     if (values.searchValue) {
    //         searchParams[searchField] = values.searchValue;
    //     }

    //     const dateParams = values.dateRange ? {
    //         createdFrom: toApiStartDate(values.dateRange[0]),
    //         createdTo: toApiEndDate(values.dateRange[1]),
    //     } : {
    //         createdFrom: undefined,
    //         createdTo: undefined,
    //     };

    //     onApply({
    //         ...searchParams,
    //         role: values.role === 'ALL' ? undefined : values.role,
    //         gender: values.gender || undefined,
    //         ...dateParams,
    //     });
    //     onClose();
    // };


    const handleFinish = (values: FilterFormValues) => {
        // Khai báo chuẩn Partial<UserFilterParams> thay vì any
        const searchParams: Partial<UserFilterParams> = {
            name: undefined,
            email: undefined,
            phone: undefined
        };

        if (values.searchValue) {
            searchParams[searchField] = values.searchValue;
        }

        const dateParams = values.dateRange ? {
            createdFrom: toApiStartDate(values.dateRange[0]),
            createdTo: toApiEndDate(values.dateRange[1]),
        } : {
            createdFrom: undefined,
            createdTo: undefined,
        };

        onApply({
            ...searchParams,
            // Ép kiểu nhẹ nhàng để khớp với UserFilterParams
            role: values.role === 'ALL' ? undefined : (values.role as UserFilterParams['role']),
            gender: (values.gender as UserFilterParams['gender']) || undefined,
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
                                { label: 'Theo Tên', value: 'name' },
                                { label: 'Theo Email', value: 'email' },
                                { label: 'Theo SĐT', value: 'phone' },
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
                    <Form.Item name="role" label={<span className="font-medium">Vai trò</span>} style={{ marginBottom: 16 }}>
                        <Select
                            options={[{ label: 'Tất cả vai trò', value: 'ALL' }, ...USER_ROLE_OPTIONS]}
                        />
                    </Form.Item>

                    <Form.Item name="gender" label={<span className="font-medium">Giới tính</span>} style={{ marginBottom: 16 }}>
                        <Select
                            options={[{ label: 'Tất cả giới tính', value: '' }, ...GENDER_OPTIONS]}
                        />
                    </Form.Item>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-2">
                    <Form.Item label={<span className="font-medium">Lọc theo ngày tham gia</span>} name="dateRange" style={{ marginBottom: 0 }}>
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