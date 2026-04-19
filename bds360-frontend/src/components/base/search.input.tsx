// @/components/base/search.input.tsx
'use client';

import { useAppTheme } from '@/hooks/use-app-theme';
import { SearchOutlined } from '@ant-design/icons';
import { Input, InputProps } from 'antd';
import { useEffect, useState } from 'react';

// Kế thừa InputProps của Antd nhưng ghi đè lại onChange để ép dùng onSearch
interface SearchInputProps extends Omit<InputProps, 'onChange' | 'value'> {
    onSearch: (value: string) => void;
    debounceDelay?: number;
    initialValue?: string;
}

export function SearchInput({
    onSearch,
    debounceDelay = 500, // Mặc định đợi 500ms sau khi ngừng gõ
    placeholder = 'Tìm kiếm dữ liệu...',
    initialValue = '',
    ...restProps
}: SearchInputProps) {
    const { colorTextPlaceholder } = useAppTheme();
    const [inputValue, setInputValue] = useState(initialValue);

    // Kỹ thuật Debounce thần thánh
    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(inputValue.trim()); // Trim khoảng trắng thừa trước khi gửi
        }, debounceDelay);

        // Cleanup function: Nếu người dùng tiếp tục gõ trước khi hết 500ms, hủy cái hẹn cũ đi
        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, debounceDelay, onSearch]);

    return (
        <Input
            size="large" // Chuẩn form SaaS thường dùng size large cho dễ nhìn
            placeholder={placeholder}
            allowClear
            prefix={
                <SearchOutlined
                    style={{ color: colorTextPlaceholder, marginRight: 4 }}
                />
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            // 👇 Tránh layout shift, set một width mặc định vừa phải (có thể ghi đè qua className)
            className={`min-w-[250px] ${restProps.className || ''}`}
            {...restProps}
        />
    );
}