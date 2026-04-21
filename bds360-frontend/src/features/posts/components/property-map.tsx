// @/features/posts/components/property-map.tsx

'use client';

import { envConfig } from '@/config/env';
import { useAppTheme } from '@/hooks/use-app-theme';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { Button } from 'antd';
import 'mapbox-gl/dist/mapbox-gl.css';
import Image from 'next/image';
import { CSSProperties, useCallback, useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';

interface PropertyMapProps {
    latitude: number;
    longitude: number;
    height?: number | string;
    className?: string;
    style?: CSSProperties;
}

export function PropertyMap({
    latitude,
    longitude,
    height = 350,
    className = '',
    style = {}
}: PropertyMapProps) {
    const { colorPrimary, colorTextLightSolid } = useAppTheme();
    const [viewState, setViewState] = useState({
        latitude,
        longitude,
        zoom: 14,
    });

    const handleViewGoogleMap = () => {
        //  FIX: URL chuẩn
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    };

    const handleMapLoad = useCallback((event: any) => {
        const map = event.target;
        // Đổi ngôn ngữ bản đồ sang Tiếng Việt
        const language = new MapboxLanguage({
            defaultLanguage: 'vi',
        });
        map.addControl(language);
        // Lưu ý: setStyle có thể ném lỗi nếu style chưa load xong, nên bọc trong try-catch
        try {
            map.setStyle(language.setLanguage(map.getStyle(), 'vi'));
        } catch (error) {
            console.warn('Mapbox Language styling failed', error);
        }
    }, []);

    return (
        <div
            className={`w-full relative rounded-sm overflow-hidden border border-gray-200 ${className}`}
            style={{ height, ...style }}
        >
            <Map
                mapboxAccessToken={envConfig.NEXT_PUBLIC_MAPBOX_KEY}
                {...viewState}
                onMove={(evt: any) => setViewState(evt.viewState)}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v12" // Update lên bản v12 mới nhất
                onLoad={handleMapLoad}
                cooperativeGestures={true}
            >
                {/* Marker vị trí BĐS */}
                <Marker
                    latitude={latitude}
                    longitude={longitude}
                    anchor="bottom"
                >
                    {/* Bọc thêm một div relative ở ngoài để chứa cả Icon và hiệu ứng Pulse */}
                    <div className="relative flex items-center justify-center">

                        {/*  VÒNG SÁNG PULSE  
                        - animate-ping: Tạo hiệu ứng tỏa ra
                        - absolute inset-1: Kích thước nhỏ hơn khung bao một chút để lúc nhịp đập trông tự nhiên
                        - bg-red-500: Tông xuyệt tông với màu đỏ của SVG (có thể đổi sang colorPrimary tùy ý)
                    */}
                        <div className="absolute inset-1 rounded-full bg-red-500 animate-ping opacity-70 [animation-duration:1.5s]" />

                        {/* ICON ĐỊA ĐIỂM CŨ 
                            - Thêm relative và z-10 để đảm bảo Icon luôn nổi lên trên vòng sáng
                        */}
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="red"
                            xmlns="http://www.w3.org/2000/svg"
                            className="relative z-10 drop-shadow-md cursor-pointer"
                        >
                            <path
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
                                fill="red"
                            />
                        </svg>
                    </div>
                </Marker>

                {/* Các nút điều khiển zoom (+/-) */}
                <NavigationControl position="top-right" />
            </Map>

            {/* Nút mở Google Maps - Sử dụng Antd Button thay vì button thuần để chuẩn style */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                <Button
                    type="primary"
                    shape="round"
                    size="middle"
                    onClick={handleViewGoogleMap}
                    style={{
                        backgroundColor: colorPrimary,
                        color: colorTextLightSolid,
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                    }}
                    className="flex items-center gap-2 px-4 py-2 font-semibold"
                >
                    {/* Thẻ Image của Next.js để tối ưu hình ảnh */}
                    <div className="relative w-4 h-4 sm:w-5 sm:h-5">
                        <Image
                            src="/google-maps.png" // Đảm bảo file này có sẵn trong folder `public/`
                            alt="Google Maps"
                            fill
                            sizes="(max-width: 768px) 16px, 20px"
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xs sm:text-sm">Xem trên Google Maps</span>
                </Button>
            </div>
        </div>
    );
}