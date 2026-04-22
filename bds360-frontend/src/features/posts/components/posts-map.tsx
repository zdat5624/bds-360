// @/features/posts/components/posts-map.tsx
'use client';

import MapboxLanguage from '@mapbox/mapbox-gl-language';
import 'mapbox-gl/dist/mapbox-gl.css';

import { useCallback, useRef, useState } from 'react';
import Map, { MapRef, Marker } from 'react-map-gl';

import { useGetPostsForMap } from '@/features/posts/api/posts.queries';
import { MapPost, PostFilterParams } from '@/features/posts/api/types';

import { envConfig } from '@/config';
import { MapDotMarker } from './map-dot-marker';
import { PostPopup } from './post-popup';
import { PriceMarker } from './price-marker';
import { VipMarker } from './vip-marker';

interface PostsMapProps {
    filters: PostFilterParams;
}

export function PostsMap({ filters }: PostsMapProps) {
    const { data: posts = [] } = useGetPostsForMap(filters);
    const [selectedMarker, setSelectedMarker] = useState<MapPost | null>(null);

    // 🌟 1. THÊM STATE QUẢN LÝ HOVER Ở CẤP ĐỘ CHA
    const [hoveredMarkerId, setHoveredMarkerId] = useState<number | null>(null);

    const mapRef = useRef<MapRef>(null);

    const handleMapLoad = useCallback((event: any) => {
        const map = event.target;
        // @ts-ignore
        const language = new MapboxLanguage({ defaultLanguage: 'vi' });
        map.addControl(language);
        map.setStyle(language.setLanguage(map.getStyle(), 'vi'));
    }, []);

    return (
        <div className="w-full h-full relative">
            <Map
                ref={mapRef}
                initialViewState={{
                    longitude: 106.71431894973796,
                    latitude: 15.986268771732355,
                    zoom: 4.5,
                }}
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
            </Map>
        </div>
    );
}