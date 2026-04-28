// @/features/posts/components/posts-map.tsx
'use client';

import MapboxLanguage from '@mapbox/mapbox-gl-language';
import 'mapbox-gl/dist/mapbox-gl.css';

import { useCallback, useEffect, useRef, useState } from 'react';
import Map, { MapboxEvent, MapRef, Marker, NavigationControl } from 'react-map-gl';

import { useGetPostsForMap } from '@/features/posts/api/posts.queries';
import { MapPost, PostFilterParams } from '@/features/posts/api/types';

import { envConfig } from '@/config';
import { HomeOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { MapDotMarker } from './map-dot-marker';
import { PostPopup } from './post-popup';
import { PriceMarker } from './price-marker';
import { VipMarker } from './vip-marker';

interface PostsMapProps {
    filters: PostFilterParams;
    isMobileMapOpen?: boolean;
}

const INITIAL_VIEW_STATE = {
    longitude: 106.71431894973796,
    latitude: 15.986268771732355,
    zoom: 4.5,
};

export function PostsMap({ filters, isMobileMapOpen }: PostsMapProps) {
    const { data: posts = [] } = useGetPostsForMap(filters);
    const [selectedMarker, setSelectedMarker] = useState<MapPost | null>(null);

    // 🌟 1. THÊM STATE QUẢN LÝ HOVER Ở CẤP ĐỘ CHA
    const [hoveredMarkerId, setHoveredMarkerId] = useState<number | null>(null);

    const mapRef = useRef<MapRef>(null);

    const handleMapLoad = useCallback((event: MapboxEvent) => {
        const map = event.target as mapboxgl.Map;

        // 1. Nếu dòng này không báo lỗi, cứ để tự nhiên
        const language = new MapboxLanguage({ defaultLanguage: 'vi' });

        // 2. Thêm control vào bản đồ
        map.addControl(language as unknown as mapboxgl.IControl);

        try {
            // 3. Thiết lập ngôn ngữ
            const style = map.getStyle();
            if (style) {
                map.setStyle(language.setLanguage(style, 'vi'));
            }
        } catch (error) {
            console.warn('Mapbox language setup failed:', error);
        }
    }, []);

    const handleResetView = () => {
        if (mapRef.current) {
            mapRef.current.flyTo({
                center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
                zoom: INITIAL_VIEW_STATE.zoom,
                duration: 1000, // Thời gian bay (ms)
                essential: true // Đảm bảo hiệu ứng chạy ngay cả khi user chọn 'reduce motion'
            });
        }
    };

    useEffect(() => {
        // Nếu mobile bật map lên, đợi 50ms cho DOM hiện thẻ div ra xong rồi bắt Mapbox resize lại
        if (isMobileMapOpen && mapRef.current) {
            setTimeout(() => {
                mapRef.current?.resize();
            }, 50);
        }
    }, [isMobileMapOpen]);

    return (
        <div className="w-full h-full relative">
            <Map
                ref={mapRef}
                initialViewState={INITIAL_VIEW_STATE}
                minZoom={4}
                maxZoom={16}
                maxBounds={[
                    [98, 5.5],
                    [116, 25.5],
                ]}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={envConfig.NEXT_PUBLIC_MAPBOX_KEY}
                onLoad={handleMapLoad}
            >
                {posts.map((post) => {
                    // 🌟 2. TÍNH TOÁN Z-INDEX ĐỘNG DỰA TRÊN VIP VÀ HOVER
                    const isHovered = hoveredMarkerId === post.postId;
                    // Vip 2 (id=3) -> 30, Vip 1 (id=2) -> 20, Thường (id=1) -> 10
                    const baseZIndex = post.vipId === 3 ? 30 : post.vipId === 2 ? 20 : 10;
                    // Hover thì nhảy lên 100 (đè lên tất cả)
                    const currentZIndex = isHovered ? 100 : baseZIndex;

                    return (
                        <Marker
                            key={`marker-${post.postId}`}
                            longitude={post.longitude}
                            latitude={post.latitude}
                            anchor="bottom"
                            onClick={(e) => {
                                e.originalEvent.stopPropagation();
                                setSelectedMarker(post);
                            }}
                            // 🌟 3. ÉP Z-INDEX TRỰC TIẾP LÊN WRAPPER CỦA MAPBOX
                            style={{ zIndex: currentZIndex }}
                        >
                            {/* 🌟 4. BẮT SỰ KIỆN HOVER ĐỂ BÁO LÊN CHA */}
                            <div
                                onMouseEnter={() => setHoveredMarkerId(post.postId)}
                                onMouseLeave={() => setHoveredMarkerId(null)}
                            >
                                {post.vipId === 1 ? (
                                    <MapDotMarker />
                                ) : post.vipId === 2 ? (
                                    <PriceMarker
                                        price={post.price}
                                        type={filters.type}
                                    />
                                ) : (
                                    <VipMarker
                                        price={post.price}
                                        vipId={post.vipId}
                                        type={filters.type}
                                    />
                                )}
                            </div>
                        </Marker>
                    );
                })}


                <PostPopup
                    post={selectedMarker}
                    onClose={() => setSelectedMarker(null)}
                />
                <NavigationControl
                    position="top-right" // Vị trí: top-right, top-left, bottom-right, bottom-left
                    showCompass={true}   // Hiện/ẩn la bàn
                    showZoom={true}      // Hiện/ẩn nút +/-
                />

                <div className="absolute top-[105px] right-[10px] z-10">
                    <Tooltip title="Về vị trí mặc định" placement="left">
                        <Button
                            icon={<HomeOutlined />}
                            onClick={handleResetView}
                            className="flex items-center justify-center shadow-md"
                            style={{
                                width: '29px',
                                height: '29px',
                                padding: 0,
                                backgroundColor: '#fff',
                                border: 'none',
                                color: '#333'
                            }}
                        />
                    </Tooltip>
                </div>
            </Map>
        </div>
    );
}