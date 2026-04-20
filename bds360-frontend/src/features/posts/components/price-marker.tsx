// @/components/composite/price-marker.tsx
'use client';

import { ListingType } from '@/constants';
import { formatPostPrice } from '@/utils/number.util';
import React, { useState } from 'react';

interface PriceMarkerProps {
    price: number;
    type?: ListingType;
    onClick?: () => void;
}

export const PriceMarker: React.FC<PriceMarkerProps> = ({ price, type, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onClick={onClick}
            style={{
                position: 'relative',
                background: '#000000', // Nền đen
                color: '#ffffff', // Chữ trắng
                padding: '2px 6px', // Padding cân đối hơn cho map marker
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                border: '1px solid #ffffff', // Viền trắng
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                transform: isHovered ? 'scale(1.1) translateY(-5px)' : 'scale(1)',
                transition: 'all 0.2s ease-out',
                zIndex: isHovered ? 10 : 1,
                userSelect: 'none',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Sử dụng hàm format đặc thù của bạn */}
            {formatPostPrice(price, type)}

            {/* Mũi nhọn phía dưới (Nền đen) */}
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

export default PriceMarker;