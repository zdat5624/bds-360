// @/components/base/data.table.tsx
'use client';

import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Table, TableProps } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';

export interface TableState {
    currentPage: number;
    pageSize: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
}

interface DataTableProps<T> {
    data: T[];
    total: number;
    loading: boolean;
    columns: ColumnsType<T>;
    tableState: TableState;
    onChangeState: (state: TableState) => void;

    enableRowSelection?: boolean;
    onRowSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;

    onRowClick?: (record: T) => void;
    showPaging?: boolean;
    rowKey?: string | ((record: T) => string);

    scroll?: TableProps<T>['scroll'];
    selectedRowKeys?: React.Key[];

    // 👇 Thêm prop bordered để linh hoạt bật/tắt (mặc định là false)
    bordered?: boolean;
}

export function DataTable<T extends object>({
    data,
    total,
    loading,
    columns,
    tableState,
    onChangeState,
    enableRowSelection = false,
    onRowSelectionChange,
    onRowClick,
    showPaging = true,
    rowKey = 'id',
    scroll,
    selectedRowKeys,
    bordered = false, // 👇 Đặt giá trị mặc định là false
}: DataTableProps<T>) {

    const { colorBorderSecondary } = useAppTheme();

    const handleChange = (
        newPagination: TablePaginationConfig,
        _: any,
        sorterParam: SorterResult<T> | SorterResult<T>[]
    ) => {
        const newState: TableState = {
            ...tableState,
            currentPage: newPagination.current || 1,
            pageSize: newPagination.pageSize || DEFAULT_PAGE_SIZE,
        };

        if (!Array.isArray(sorterParam) && sorterParam.field) {
            newState.sortBy = sorterParam.field as string;
            newState.sortDirection =
                sorterParam.order === 'ascend' ? 'ASC' :
                    sorterParam.order === 'descend' ? 'DESC' : undefined;
        } else {
            newState.sortBy = undefined;
            newState.sortDirection = undefined;
        }

        onChangeState(newState);
    };

    return (
        <Table<T>
            className="custom-table"
            // 👇 Thêm logic: Nếu bordered = true mới thêm style biến màu viền, ngược lại bỏ trống
            style={
                bordered
                    ? { '--table-border-color': colorBorderSecondary } as React.CSSProperties
                    : undefined
            }
            bordered={bordered}
            rowKey={rowKey}
            rowSelection={
                enableRowSelection
                    ? {
                        type: 'checkbox',
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            onRowSelectionChange?.(selectedRowKeys, selectedRows);
                        },
                    }
                    : undefined
            }
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={showPaging ? {
                current: tableState.currentPage,
                pageSize: tableState.pageSize,
                total: total,
                showTotal: (t, r) => `Hiển thị ${r[0]}-${r[1]} trong tổng số ${t}`,
                showSizeChanger: true,
                pageSizeOptions: PAGE_SIZE_OPTIONS,
            } : false}
            onRow={(record) => ({
                onClick: () => onRowClick?.(record),
                className: onRowClick ? 'cursor-pointer' : '',
            })}
            onChange={handleChange}
            scroll={scroll ? (data?.length > 0 ? scroll : undefined) : (data?.length > 0 ? { x: 'max-content' } : undefined)}
        />
    );
}