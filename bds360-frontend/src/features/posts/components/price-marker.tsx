// @/features/posts/components/price-marker.tsx
'use client';

import { ListingType } from '@/constants';
import React, { useState } from 'react';
import { formatPostPrice } from '../posts.util';

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
                background: '#000000',
                color: 'white',
                // Tăng padding trái/phải lên 4px cho cân đối vì không có chữ VIP
                padding: '1px 4px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                border: '1px solid white',
                boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                zIndex: 2,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span>{formatPostPrice(price)}</span>

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
                    borderTop: '6px solid white',
                    zIndex: 0,
                }}
            />
        </div>
    );
};

export default PriceMarker;