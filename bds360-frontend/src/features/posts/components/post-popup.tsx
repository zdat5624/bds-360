// @/features/posts/components/post-popup.tsx
'use client';

import { useGetPostById } from '@/features/posts/api/posts.queries';
import { MapPost } from '@/features/posts/api/types';
import { Spin } from 'antd';
import Link from 'next/link';
import React from 'react';
import { Popup } from 'react-map-gl';
import { formatPostPrice } from '../posts.util';

interface PostPopupProps {
    post: MapPost | null;
    onClose: () => void;
}

export const PostPopup: React.FC<PostPopupProps> = ({ post, onClose }) => {
    const { data: postDetails, isLoading: loading, isError: error } = useGetPostById(
        post?.postId as number,
        !!post?.postId
    );

    if (!post) return null;

    if (loading) {
        return (
            <Popup
                longitude={post.longitude}
                latitude={post.latitude}
                onClose={onClose}
                closeOnClick={true}
                anchor="bottom"
                style={{ zIndex: 1000 }} // 🌟 Ép z-index trực tiếp
            >
                <div style={{ padding: '10px' }}>
                    <Spin description={"Đang tải"} size="small" />
                </div>
            </Popup>
        );
    }

    if (error || !postDetails) {
        return (
            <Popup
                longitude={post.longitude}
                latitude={post.latitude}
                onClose={onClose}
                closeOnClick={true}
                anchor="bottom"
                style={{ zIndex: 1000 }}
            >
                <div style={{ padding: '10px' }}>
                    <p>Không có dữ liệu</p>
                </div>
            </Popup>
        );
    }

    const vipColor = postDetails.vip?.id === 2 ? '#FFD700' : '#FF4500';

    const coverImage = postDetails.images && postDetails.images.length > 0
        ? postDetails.images[0].url
        : '/placeholder-image.jpg';

    return (
        <Popup
            longitude={post.longitude}
            latitude={post.latitude}
            onClose={onClose}
            closeOnClick={false}
            anchor="bottom"
            // 🌟 QUAN TRỌNG: Ép z-index cực cao để đè lên các Marker VIP
            style={{ zIndex: 9999 }}
        >
            <Link
                href={`/posts/${postDetails.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
                target="_blank"
                rel="noopener noreferrer"
            >
                <div style={{ padding: '2px', maxWidth: '300px' }}>
                    <div style={{ position: 'relative', marginBottom: '5px' }}>
                        <img
                            src={coverImage}
                            alt="Hình ảnh"
                            style={{
                                width: '100%',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '5px',
                            }}
                        />

                        {postDetails.vip?.id !== 1 && (
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '5px',
                                    left: '5px',
                                    backgroundColor: vipColor,
                                    color: '#FFF',
                                    padding: '2px 5px',
                                    borderRadius: '3px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    display: 'inline-block',
                                }}
                            >
                                VIP
                            </span>
                        )}
                    </div>

                    <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                        {postDetails.title}
                    </h4>

                    <p style={{ margin: '0 0 5px 0', color: '#FF4500', fontWeight: 'bold', fontSize: '15px' }}>
                        {formatPostPrice(postDetails.price)}
                    </p>

                    <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                        <strong>Diện tích:</strong> {postDetails.area} m²
                    </p>
                </div>
            </Link>
        </Popup>
    );
};