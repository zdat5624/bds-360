// @/components/composite/map-selector.tsx
'use client';

import "mapbox-gl/dist/mapbox-gl.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Map, { MapRef, MapboxEvent, Marker, NavigationControl } from "react-map-gl";
// @ts-ignore - plugin này thường không có type definition sẵn
import { envConfig } from "@/config";
import MapboxLanguage from "@mapbox/mapbox-gl-language";

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

const MapSelector: React.FC<MapSelectorProps> = ({
    latitude,
    longitude,
    onChange,
    isUserModified,
    setIsUserModified
}) => {
    const defaultZoom = 15;
    const mapRef = useRef<MapRef>(null);

    // Tọa độ mặc định (VD: TP.HCM) nếu không có props truyền vào
    const [viewport, setViewport] = useState<ViewportState>({
        latitude: latitude || 10.775844,
        longitude: longitude || 106.701756,
        zoom: defaultZoom,
    });

    // Đồng bộ tọa độ từ props vào map khi props thay đổi (nhưng user chưa tương tác tay)
    useEffect(() => {
        if (latitude && longitude && !isUserModified && !isNaN(latitude) && !isNaN(longitude)) {
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
                    duration: 1000, // Tăng duration để mượt hơn
                });
            }
        }
    }, [latitude, longitude, isUserModified]);

    // Xử lý khi Map di chuyển (kéo thả bản đồ)
    const handleMove = useCallback(() => {
        if (mapRef.current) {
            const center = mapRef.current.getCenter();
            const newCoordinates: Coordinates = {
                latitude: center.lat,
                longitude: center.lng,
            };

            setViewport((prev) => ({
                ...prev,
                ...newCoordinates,
            }));

            onChange(newCoordinates);
            setIsUserModified(true);
        }
    }, [onChange, setIsUserModified]);

    const handleConfirm = () => {
        // Fix lỗi template string từ code cũ
        const googleMapsUrl = `https://www.google.com/maps?q=${viewport.latitude},${viewport.longitude}`;
        window.open(googleMapsUrl, "_blank");
    };

    const handleMapLoad = (event: MapboxEvent) => {
        const map = event.target;
        const language = new MapboxLanguage({
            defaultLanguage: 'vi',
        });
        map.addControl(language);
        // Thiết lập ngôn ngữ hiển thị là Tiếng Việt
        map.setStyle(language.setLanguage(map.getStyle(), 'vi'));
    };

    // Helper để xử lý style responsive đơn giản
    const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;

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
                    {/* Marker luôn nằm ở tâm của Viewport */}
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

                <button
                    type="button"
                    onClick={handleConfirm}
                    title="Bấm vào để mở Google Map ứng với vị trí trên bản đồ"
                    style={{
                        position: "absolute",
                        bottom: "1.5rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: isMobile ? "0.4rem 0.8rem" : "0.6rem 1.2rem",
                        backgroundColor: "#1677ff", // Màu primary của AntD
                        color: "white",
                        border: "none",
                        borderRadius: "25px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontWeight: "bold",
                        fontSize: isMobile ? "12px" : "14px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        transition: "all 0.3s ease",
                        zIndex: 10,
                        whiteSpace: "nowrap",
                    }}
                >
                    <img
                        src="/Google_Maps_icon_(2020).svg.png"
                        alt="Google Maps"
                        style={{
                            width: isMobile ? "14px" : "18px",
                            height: isMobile ? "14px" : "18px",
                        }}
                    />
                    Xem trên Google Map
                </button>
            </div>
        </div>
    );
};

export default MapSelector;