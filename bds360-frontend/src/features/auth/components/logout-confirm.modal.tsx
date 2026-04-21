// @/features/auth/components/logout-confirm.modal.tsx
'use client';

import { ConfirmModal } from '@/components/base';
import { APP_ROUTES } from '@/config/routes';
import { useAuthStore } from '@/stores/auth.store';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function LogoutConfirmModal({ isOpen, onClose }: Props) {
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        onClose();
        router.push(APP_ROUTES.PUBLIC.HOME);
        message.success('Đăng xuất thành công!');
    };

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleLogout}
            title="Xác nhận đăng xuất"
            content="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống BDS360 không?"
            okText="Đăng xuất"
            cancelText="Hủy"
            type='warning'
        />
    );
}