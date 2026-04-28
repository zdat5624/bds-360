// @/components/composite/reveal-phone-button.tsx
'use client';

import { APP_ROUTES } from '@/config';
import { useNotifyViewPhone } from '@/features/notifications/api/notifications.mutations';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store'; // Import store quản lý Auth (nếu có)
import { CheckOutlined, CopyOutlined, PhoneOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useRouter } from 'next/navigation'; // 👈 Thêm useRouter
import { useState } from 'react';

interface RevealPhoneButtonProps {
    phone?: string;
    postId?: number; // Optional, dùng ở trang chi tiết tin đăng
    recipientId?: number; // ID của chủ tin (người nhận thông báo)
    className?: string;
}

export function RevealPhoneButton({ phone, postId, recipientId, className }: RevealPhoneButtonProps) {
    const [showPhone, setShowPhone] = useState(false);
    const [copied, setCopied] = useState(false);
    const router = useRouter(); // 👈 Khởi tạo router
    // console.log("recipientId:", recipientId)
    // Khởi tạo mutation để gửi thông báo
    const notifyViewPhoneMutation = useNotifyViewPhone();

    // Lấy trạng thái đăng nhập để kiểm tra
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Tiền xử lý chuỗi số điện thoại
    const safePhone = phone || '';

    const maskedPhone = safePhone.length >= 4
        ? `${safePhone.slice(0, 4)} ${safePhone.slice(4, 8)} ***`
        : 'Chưa cập nhật';

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn sự kiện lan ra ngoài
        e.preventDefault();

        if (safePhone) {
            navigator.clipboard.writeText(safePhone);
            setCopied(true);
            message.success('Đã sao chép số điện thoại!');

            // Đổi lại icon copy sau 2 giây
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!safePhone) {
            alert('Người dùng này chưa cung cấp số điện thoại.');
            return;
        }

        // 🌟 KIỂM TRA ĐĂNG NHẬP 🌟
        if (!isAuthenticated) {
            message.info('Vui lòng đăng nhập để xem số điện thoại!');
            // Chuyển hướng đến trang đăng nhập. 
            // Có thể thêm tham số ?callbackUrl để họ đăng nhập xong quay lại đúng trang này
            router.push(APP_ROUTES.AUTH.LOGIN);
            return; // Dừng thực thi các lệnh bên dưới
        }

        if (!showPhone) {
            // --- LẦN 1: BẤM ĐỂ HIỆN SỐ ---
            setShowPhone(true);

            // Gửi thông báo ngầm xuống Backend (lúc này chắc chắn isAuthenticated = true)
            if (recipientId) {
                notifyViewPhoneMutation.mutate({
                    recipientId: recipientId,
                    postId: postId
                });
            }

        } else {
            // // --- LẦN 2: ĐÃ HIỆN SỐ RỒI THÌ BẤM ĐỂ GỌI ĐIỆN ---
            // window.location.href = `tel:${safePhone}`;
        }
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "group relative w-full flex items-center justify-center gap-1.5 h-10 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98]",
                showPhone
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-[#0068FF] hover:bg-[#0052cc] text-white shadow-sm",
                className
            )}
        >
            <PhoneOutlined className={cn("text-lg", showPhone ? "text-blue-600" : "text-white")} />

            <span className="text-[12px] tracking-wide">
                {showPhone ? safePhone : maskedPhone}
            </span>

            {!showPhone && (
                <span className="ml-1 text-[10px] bg-white/20 px-1 py-0.5 rounded-full font-medium  hidden sm:inline-block">
                    Hiện số
                </span>
            )}

            {/* --- NÚT SAO CHÉP (Chỉ hiện khi đã show số) --- */}
            {showPhone && (
                <div
                    onClick={handleCopy}
                    className="shrink-0 ml-1 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-100 transition-colors"
                    title="Sao chép số điện thoại"
                >
                    {copied ? (
                        <CheckOutlined className="!text-[15px] !text-green-600" />
                    ) : (
                        <CopyOutlined className="!text-[15px] !text-blue-600 opacity-80 group-hover:opacity-100" />
                    )}
                </div>
            )}
        </button>
    );
}