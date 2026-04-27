'use client';

import { ConfirmModal } from '@/components/base/confirm.modal';

interface CancelPostCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function CancelPostCreationModal({
    isOpen,
    onClose,
    onConfirm,
}: CancelPostCreationModalProps) {
    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Xác nhận hủy đăng tin"
            content={
                <div>
                    <p className="m-0">Bạn có chắc chắn muốn hủy bỏ không?</p>
                    <p className="m-0 text-red-500 text-xs mt-1">
                        * Mọi thông tin bạn đã nhập sẽ bị xóa và không thể khôi phục.
                    </p>
                </div>
            }
            type="danger"
            okText="Xác nhận hủy"
            cancelText="Tiếp tục đăng tin"
        />
    );
}