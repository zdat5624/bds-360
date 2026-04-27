// @/features/transactions/components/top-up.button.tsx
'use client';

import { Button, ButtonProps } from 'antd';
import { useState } from 'react';
import { TopUpModal } from './top-up.modal';



export function TopUpButton(props: ButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Truyền toàn bộ props (như type, size, className, icon...) vào Button */}
            <Button
                {...props}
                onClick={(e) => {
                    setIsOpen(true);
                    // Giữ lại hàm onClick gốc nếu có truyền từ component cha vào
                    props.onClick?.(e);
                }}
            />

            {/* Modal nằm im lìm ở đây và tự quản lý state của nó */}
            <TopUpModal
                open={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}