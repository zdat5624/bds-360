// @/components/composite/vip-marker.tsx
'use client';

import { ListingType } from '@/constants';
import { formatPostPrice } from '@/utils/number.util';
import React, { useState } from 'react';

interface VipMarkerProps {
    price: number;
    vipId: number;
    type?: ListingType;
    onClick?: () => void;
}

export const VipMarker: React.FC<VipMarkerProps> = ({ price, vipId, type, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    /**
     * Định nghĩa màu sắc dựa trên VIP Level
     * VIP 1 (ID: 2) -> Màu Vàng Gold
     * VIP 2 (ID: 3) -> Màu Đỏ Cam (Volcano) - Cao cấp nhất
     */
    const getVipStyles = (id: number) => {
        if (id === 3) { // VIP 2
            return {
                badge: 'rgb(255, 69, 0)', // Đỏ cam đặc trưng
                shadow: isHovered ? '0 0 12px rgba(255, 69, 0, 0.6)' : '0 2px 4px rgba(0,0,0,0.3)',
                border: '1px solid #ffffff'
            };
        }
        if (id === 2) { // VIP 1
            return {
                badge: '#FFD700', // Vàng Gold
                shadow: isHovered ? '0 0 8px rgba(255, 215, 0, 0.5)' : '0 2px 4px rgba(0,0,0,0.3)',
                border: '1px solid #ffffff'
            };
        }
        return { badge: '#666', shadow: '0 2px 4px rgba(0,0,0,0.3)', border: '1px solid white' };
    };

    const styles = getVipStyles(vipId);

    return (
        <div
            onClick={onClick}
            style={{
                position: 'relative',
                background: '#000000',
                color: 'white',
                padding: '2px 4px 2px 8px', // Padding trái rộng hơn để cân đối với badge VIP bên phải
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                border: styles.border,
                boxShadow: styles.shadow,
                fontSize: '13px',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transform: isHovered ? 'scale(1.15) translateY(-5px)' : 'scale(1)',
                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                zIndex: isHovered ? 10 : 2,
                userSelect: 'none',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Sử dụng hàm format đặc thù của bạn */}
            <span>{formatPostPrice(price, type)}</span>

            {/* Badge VIP */}
            <span
                style={{
                    background: styles.badge,
                    color: 'white',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    lineHeight: '1.2',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
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
                    borderTop: '6px solid #000000',
                    zIndex: 2,
                }}
            />

            {/* Viền trắng cho mũi nhọn */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '7px solid transparent',
                    borderRight: '7px solid transparent',
                    borderTop: '7px solid #ffffff',
                    zIndex: 1,
                }}
            />
        </div>
    );
};

export default VipMarker;