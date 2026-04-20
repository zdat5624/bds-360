// @/components/composite/filter.modal.tsx
"use client";

import { AppModal } from "@/components/base/app.modal";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Button } from "antd";
import React from "react";

export interface FilterModalProps {
    /** Cờ điều khiển đóng/mở từ component Cha */
    isOpen: boolean;
    /** Hàm trigger khi cần đóng Modal (để Cha đổi state) */
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    onApply?: () => void;
    onReset?: () => void;
    width?: number | string;
}

export const FilterModal: React.FC<FilterModalProps> = ({
    isOpen,
    onClose,
    title = "Bộ lọc",
    children,
    onApply,
    onReset,
    width = 600,
}) => {
    const { colorSplit } = useAppTheme();

    const handleApply = () => {
        if (onApply) onApply();
        onClose(); // Auto đóng modal sau khi apply
    };

    return (
        <AppModal
            title={title}
            isOpen={isOpen}
            onClose={onClose}
            width={width}
        >
            <div>{children}</div>

            <div
                className="flex justify-end gap-2 mt-6 pt-4 border-t border-solid"
                style={{ borderColor: colorSplit }}
            >
                <Button onClick={onReset}>Thiết lập lại</Button>
                <Button type="primary" onClick={handleApply}>
                    Áp dụng
                </Button>
            </div>
        </AppModal>
    );
};