// @/components/base/filter.button.tsx
"use client";

import { useAppTheme } from "@/hooks/use-app-theme";
import { CloseOutlined, FilterOutlined } from "@ant-design/icons";
import { Badge, Button, ButtonProps, Space, Tooltip } from "antd";
import React, { useState } from "react";

interface FilterButtonProps extends ButtonProps {
    /** Số lượng tiêu chí đang được áp dụng */
    activeCount?: number;
    /** Cờ báo hiệu đang có filter */
    isActive?: boolean;
    /** Hàm xóa nhanh toàn bộ filter */
    onClear?: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
    activeCount = 0,
    isActive = false,
    onClear,
    children = "Bộ lọc",
    icon = <FilterOutlined />,
    ...restProps
}) => {
    const {
        colorPrimary,
        colorPrimaryBg,
        colorFillTertiary,
        colorFillSecondary,
        borderRadiusSM,
        colorTextDescription
    } = useAppTheme();

    const [isXHovered, setIsXHovered] = useState(false);
    const hasActiveFilters = activeCount > 0 || isActive;

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClear) onClear();
    };

    return (
        <Badge count={activeCount} size="small" offset={[-4, 4]}>
            <Button
                icon={icon}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.3s',
                    ...(hasActiveFilters ? {
                        color: colorPrimary,
                        borderColor: colorPrimary,
                        backgroundColor: colorPrimaryBg,
                    } : {}),
                }}
                {...restProps}
            >
                <Space size={6}>
                    <span>{children}</span>

                    {/* Bọc nút X bằng Tooltip để giải thích tính năng */}
                    {hasActiveFilters && onClear && (
                        <Tooltip
                            title="Bỏ tất cả lọc"
                            arrow={{ pointAtCenter: true }}
                            // Chỉ cho phép hiện trên Desktop (thiết bị có chuột)
                            mouseEnterDelay={0.5}
                            // Ngăn chặn việc hiện tooltip trên touch
                            trigger={['hover']}
                        >
                            <CloseOutlined
                                onMouseEnter={() => setIsXHovered(true)}
                                onMouseLeave={() => setIsXHovered(false)}
                                onClick={handleClear}
                                style={{
                                    fontSize: 10,
                                    padding: '2px',
                                    borderRadius: borderRadiusSM,
                                    transition: 'all 0.2s',
                                    color: hasActiveFilters ? colorPrimary : colorTextDescription,
                                    backgroundColor: isXHovered ? colorFillSecondary : colorFillTertiary,
                                    cursor: 'pointer',
                                }}
                            />
                        </Tooltip>
                    )}
                </Space>
            </Button>
        </Badge>
    );
};