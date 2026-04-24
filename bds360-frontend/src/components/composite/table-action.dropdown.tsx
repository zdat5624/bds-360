// @/components/composite/table-action.dropdown.tsx
'use client';

import { useAppTheme } from '@/hooks/use-app-theme';
import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps } from 'antd';
import React from 'react';

export interface ActionItem {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    danger?: boolean;
    disabled?: boolean;
    color?: string;
    onClick: () => void;
}

interface TableActionDropdownProps {
    actions: ActionItem[];
}

export function TableActionDropdown({ actions }: TableActionDropdownProps) {
    const { colorTextSecondary } = useAppTheme();

    // Map dữ liệu từ interface ActionItem sang định dạng MenuProps['items'] của Ant Design
    const menuItems: MenuProps['items'] = actions.map((action) => ({
        key: action.key,
        label: action.label,
        icon: action.icon,
        danger: action.danger,
        disabled: action.disabled,
        // 👈 Áp dụng màu sắc vào style của thẻ <li> bên trong Menu
        style: action.color ? { color: action.color } : undefined,
        onClick: (e) => {
            e.domEvent.stopPropagation(); // Ngăn click xuyên xuống hàng (Row) của bảng
            action.onClick();
        },
    }));

    return (
        <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomRight"
        >
            <Button
                type="text"
                shape="default"
                className='!p-1'
                // Dùng EllipsisOutlined và xoay 90 độ để có 3 dấu chấm dọc chuẩn
                icon={<EllipsisOutlined rotate={90} style={{ color: colorTextSecondary, fontSize: 15 }} />}
                onClick={(e) => e.stopPropagation()} // Ngăn click xuyên xuống hàng khi mới bấm mở menu
            />
        </Dropdown>
    );
}