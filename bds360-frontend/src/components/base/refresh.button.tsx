// @/components/base/refresh.button.tsx
"use client";

import { ReloadOutlined } from "@ant-design/icons";
import { Button, ButtonProps, Tooltip } from "antd";
import React from "react";

interface RefreshButtonProps extends ButtonProps {
    /** Tooltip hiển thị khi hover */
    tooltip?: string;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
    tooltip = "Làm mới",
    ...restProps
}) => {
    return (
        <Tooltip title={tooltip}>
            <Button
                icon={<ReloadOutlined />}
                {...restProps}
            />
        </Tooltip>
    );
};