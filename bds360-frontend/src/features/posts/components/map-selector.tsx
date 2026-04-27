'use client';

import { envConfig } from "@/config";
import { useAppTheme } from "@/hooks";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import { Button } from "antd";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Map, { MapRef, MapboxEvent, Marker, NavigationControl, ViewStateChangeEvent } from "react-map-gl";

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface MapSelectorProps {
    latitude?: number;
    longitude?: number;
    onChange: (coords: Coordinates) => void;
    isUserModified: boolean;
    setIsUserModified: (modified: boolean) => void;
}

interface ViewportState {
    latitude: number;
    longitude: number;
    zoom: number;
}

export const MapSelector: React.FC<MapSelectorProps> = ({
    latitude,
    longitude,
    onChange,
    isUserModified,
    setIsUserModified
}) => {
    const { colorPrimary, colorTextLightSolid } = useAppTheme();

    const handleViewGoogleMap = () => {
        //  FIX lỗi cú pháp URL Google Maps cũ
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${viewport.latitude},${viewport.longitude}`;
        window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    };

    const defaultZoom = 15;
    const mapRef = useRef<MapRef>(null);

    //  THÊM STATE: Theo dõi xem map đã thực hiện cú "bay" đầu tiên khi load dữ liệu Edit chưa
    const [hasInitialFlown, setHasInitialFlown] = useState(false);

    const [viewport, setViewport] = useState<ViewportState>({
        latitude: latitude || 10.775844,
        longitude: longitude || 106.701756,
        zoom: defaultZoom,
    });

    // Đồng bộ tọa độ vào Map
    useEffect(() => {
        if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {

            //  LOGIC MỚI: 
            // 1. Nếu là lần đầu tiên có tọa độ (hasInitialFlown = false) -> Luôn bay tới (Dành cho Edit)
            // 2. Hoặc nếu User không tự tay sửa (!isUserModified) -> Bay tới (Dành cho auto Geocode)
            if (!hasInitialFlown || !isUserModified) {
                setViewport((prev) => ({
                    ...prev,
                    latitude,
                    longitude,
                    zoom: defaultZoom,
                }));

                if (mapRef.current) {
                    mapRef.current.flyTo({
                        center: [longitude, latitude],
                        zoom: defaultZoom,
                        duration: 1000,
                    });
                }

                // Đánh dấu là đã bay xong lần đầu
                setHasInitialFlown(true);
            }
        }
    }, [latitude, longitude, isUserModified, hasInitialFlown]);

    const handleMove = useCallback((evt: ViewStateChangeEvent) => {
        setViewport(evt.viewState);

        // evt.originalEvent có nghĩa là TAY người dùng thực sự kéo/zoom bản đồ
        if (evt.originalEvent) {
            const newCoordinates: Coordinates = {
                latitude: evt.viewState.latitude,
                longitude: evt.viewState.longitude,
            };
            onChange(newCoordinates);
            setIsUserModified(true);
        }
    }, [onChange, setIsUserModified]);

    const handleMapLoad = (event: MapboxEvent) => {
        const map = event.target;
        const language = new MapboxLanguage({
            defaultLanguage: 'vi',
        });
        map.addControl(language);
        map.setStyle(language.setLanguage(map.getStyle(), 'vi'));
    };

    return (
        <div className="w-full">
            <div style={{ height: "500px", width: "100%", position: "relative", borderRadius: '8px', overflow: 'hidden' }}>
                <Map
                    ref={mapRef}
                    mapboxAccessToken={envConfig.NEXT_PUBLIC_MAPBOX_KEY}
                    initialViewState={viewport}
                    onMove={handleMove}
                    style={{ width: "100%", height: "100%" }}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    cooperativeGestures={true}
                    onLoad={handleMapLoad}
                    minZoom={3}
                    maxZoom={20}
                >
                    <Marker latitude={viewport.latitude} longitude={viewport.longitude} anchor="bottom">
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="red"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
                                fill="red"
                            />
                        </svg>
                    </Marker>
                    <NavigationControl position="bottom-right" />
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
                        className="flex items-center gap-2 px-4 !py-4 font-semibold"
                    >
                        <div className="relative w-5 h-5 sm:w-6 sm:h-6">
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
        </div>
    );
};