// @/features/posts/components/map-dot-marker.tsx
import React, { useState } from 'react';

interface MapDotMarkerProps {
    color?: string;
    borderColor?: string;
    onPointClick?: () => void;
}

export const MapDotMarker: React.FC<MapDotMarkerProps> = ({
    color = '#342c29',
    borderColor = '#ffffff',
    onPointClick,
}) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    // Scale y hệt thiết kế cũ
    const size = isHovered ? 14 : 10;

    return (
        <div
            role="button"
            onClick={(e) => {
                e.stopPropagation();
                onPointClick?.();
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="cursor-pointer transition-all duration-200 ease-in-out flex items-center justify-center"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                borderRadius: '50%',
                border: `2px solid ${borderColor}`,
                boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                transform: 'translate(-50%, -50%)',
                position: 'absolute',
                boxSizing: 'border-box',
            }}
        />
    );
};