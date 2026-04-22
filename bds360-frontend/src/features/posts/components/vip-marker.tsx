// @/features/posts/components/vip-marker.tsx
'use client';

import { ListingType } from '@/constants';
import React, { useState } from 'react';
import { formatPostPrice } from '../posts.util'; // Đảm bảo đường dẫn này đúng với dự án của bạn

interface VipMarkerProps {
    price: number;
    vipId: number;
    type?: ListingType;
    onClick?: () => void;
}

export const VipMarker: React.FC<VipMarkerProps> = ({ price, vipId, type, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Xác định màu của ô "VIP" dựa trên vipId (Giữ y hệt logic cũ)
    const vipColor = '#FF4500';

    return (
        <div
            onClick={onClick}
            style={{
                position: 'relative',
                background: '#000000', // Màu đen cho nền
                color: 'white', // Chữ màu trắng
                padding: '1px 2px', // Kích thước Marker giữ nguyên
                borderRadius: '4px', // Bo tròn nhẹ
                cursor: 'pointer',
                fontWeight: 'bold',
                border: '1px solid white', // Viền trắng
                boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                fontSize: '12px', // Kích thước chữ cho giá
                whiteSpace: 'nowrap',
                transform: isHovered ? 'scale(1.2)' : 'scale(1)', // Hiệu ứng phóng to khi hover
                transition: 'transform 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                zIndex: 2,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span>{formatPostPrice(price)}</span>
            <span
                style={{
                    background: vipColor, // Màu của ô "VIP"
                    color: 'white',
                    padding: '3px 4px', // Điều chỉnh padding
                    borderRadius: '3px',
                    fontSize: '10px', // Tích thước chữ của "VIP"
                    lineHeight: '1',
                    textShadow: '0 0 1px rgba(0, 0, 0, 1)', // Viền mờ màu đen
                }}
            >
                VIP
            </span>

            {/* Mũi nhọn phía dưới */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid #000000', // Màu mũi nhọn khớp với nền (đen)
                    zIndex: 2,
                }}
            />
            {/* Viền trắng cho mũi nhọn */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '-7px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid white', // Viền trắng
                    zIndex: 0,
                }}
            />
        </div>
    );
};

export default VipMarker;