// @/features/posts/components/map-dot-marker.tsx
import React, { useState } from 'react';

interface MapDotMarkerProps {
    /** Màu xám đậm cho tin thường, giúp giảm sự chú ý so với tin VIP */
    color?: string;
    borderColor?: string;
    onPointClick?: () => void;
}

/**
 * MapDotMarker - Phiên bản tối giản cho tin đăng miễn phí.
 * Đặc điểm: Viền siêu mỏng, màu sắc trung tính, không đổ bóng mạnh.
 */
export const MapDotMarker: React.FC<MapDotMarkerProps> = ({
    color = '#595959', // Màu xám (Antd colorTextSecondary), ít nổi bật hơn đen
    borderColor = '#ffffff',
    onPointClick,
}) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    // Kích thước nhỏ hơn một chút để trông thanh mảnh hơn
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

                // VIỀN SIÊU MỎNG: 1px là giới hạn tinh tế nhất
                border: `1px solid ${borderColor}`,

                // Bỏ Shadow hoặc dùng shadow cực mờ để Marker "lặn" vào bản đồ hơn
                boxShadow: '0 1px 2px rgba(0,0,0,0.15)',

                // Căn tâm chuẩn Mapbox
                transform: 'translate(-50%, -50%)',
                position: 'absolute',

                boxSizing: 'border-box',
                zIndex: isHovered ? 100 : 1,
            }}
        />
    );
};