// @/features/posts/components/property-map.tsx
'use client';

import { envConfig } from '@/config/env';
import { useAppTheme } from '@/hooks/use-app-theme';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { Button } from 'antd';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Image from 'next/image';
import { CSSProperties, useCallback, useState } from 'react';
import Map, { MapboxEvent, Marker, NavigationControl, ViewStateChangeEvent } from 'react-map-gl';

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
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

        window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    };
    // ✅ FIX: Thay 'any' bằng 'MapboxEvent'
    const handleMapLoad = useCallback((event: MapboxEvent) => {
        const map = event.target as mapboxgl.Map;

        // Đổi ngôn ngữ bản đồ sang Tiếng Việt
        const language = new MapboxLanguage({
            defaultLanguage: 'vi',
        });

        map.addControl(language);

        try {
            // Ép kiểu 'any' ở đây vì thư viện plugin này đôi khi không khớp hoàn toàn với Mapbox v2/v3
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map.setStyle(language.setLanguage(map.getStyle(), 'vi') as any);
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
                onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                onLoad={handleMapLoad}
                cooperativeGestures={true}
            >
                <Marker
                    latitude={latitude}
                    longitude={longitude}
                    anchor="bottom"
                >
                    <div className="relative flex items-center justify-center">
                        {/* VÒNG SÁNG PULSE */}
                        <div className="absolute inset-1 rounded-full bg-red-500 animate-ping opacity-70 [animation-duration:1.5s]" />

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

                <NavigationControl position="top-right" />
            </Map>

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
                    <div className="relative w-4 h-4 sm:w-5 sm:h-5">
                        <Image
                            src="/google-maps.png"
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