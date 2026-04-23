import { MANAGE_MENU_ITEMS, USER_MENU_ITEMS } from '@/constants/menus.constant';
import React from 'react';

export const getPageMeta = (key: string): { icon: React.ReactNode; title: string } => {
    const findMeta = (items: any[], searchKey: string): { icon: React.ReactNode; title: string } | null => {
        if (!items) return null;

        for (const item of items) {
            if (item?.key === searchKey) {
                // Rút trích chuỗi text bên trong thẻ <Link> hoặc text thường
                const title = item.label?.props?.children || (typeof item.label === 'string' ? item.label : '');
                return { icon: item.icon, title };
            }

            if (item?.children) {
                const found = findMeta(item.children, searchKey);
                if (found) return found;
            }
        }
        return null;
    };

    const foundMeta = findMeta(MANAGE_MENU_ITEMS as any[], key) || findMeta(USER_MENU_ITEMS as any[], key);
    return foundMeta || { icon: null, title: 'BDS 360' };
};