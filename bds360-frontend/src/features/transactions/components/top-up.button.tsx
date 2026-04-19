// @/features/transactions/components/top-up.button.tsx
'use client';

import { Button, ButtonProps } from 'antd';
import { useState } from 'react';
import { TopUpModal } from './top-up.modal';

// Component này kế thừa toàn bộ thuộc tính (props) của Antd Button
interface TopUpButtonProps extends ButtonProps {
    // Bạn có thể định nghĩa thêm các props đặc thù ở đây nếu cần
}

export function TopUpButton(props: TopUpButtonProps) {
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