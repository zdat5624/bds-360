// @/app/(main)/(public)/posts/[id]/post-gallery.tsx
'use client';

import { Post } from '@/features/posts/api/types';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Image } from 'antd';
import { useMemo, useRef, useState } from 'react';

interface PostGalleryProps {
    post: Post;
}

export function PostGallery({ post }: PostGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const thumbRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const images = useMemo(() => {
        if (!post?.images || post.images.length === 0)
            return ['https://placehold.co/600x400?text=No+Image'];
        return [...post.images]
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map(img => img.url);
    }, [post]);

    const handlePrev = () => setActiveIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
    const handleNext = () => setActiveIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));

    const onMouseDown = (e: React.MouseEvent) => {
        if (!thumbRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - thumbRef.current.offsetLeft);
        setScrollLeft(thumbRef.current.scrollLeft);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !thumbRef.current) return;
        e.preventDefault();
        const x = e.pageX - thumbRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        thumbRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="flex flex-col gap-2 mb-2">
            <Image.PreviewGroup>
                <div
                    className="relative w-full h-[345px] rounded-md overflow-hidden flex items-center justify-center select-none"
                    style={{
                        background: 'radial-gradient(circle, #757575 0%, #606060 100%)'
                    }}
                >
                    <Image
                        src={images[activeIndex]}
                        alt="Main"
                        rootClassName="!w-full !h-full"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        // Ngăn kéo ảnh chính
                        draggable={false}
                    />
                    {images.length > 1 && (
                        <>
                            <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10">
                                <Button shape="circle" icon={<LeftOutlined />} onClick={handlePrev} className="opacity-70 hover:opacity-100" />
                            </div>
                            <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
                                <Button shape="circle" icon={<RightOutlined />} onClick={handleNext} className="opacity-70 hover:opacity-100" />
                            </div>
                            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-md text-xs font-medium backdrop-blur-sm z-10 bg-black/50 text-white">
                                {activeIndex + 1} / {images.length}
                            </div>
                        </>
                    )}
                </div>

                {images.length > 1 && (
                    <div
                        ref={thumbRef}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseLeave={() => setIsDragging(false)}
                        // select-none giúp trải nghiệm kéo mượt hơn
                        className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {images.map((url, idx) => (
                            <div
                                key={idx}
                                className={`flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 transition-all w-16 h-16 flex items-center justify-center ${activeIndex === idx ? 'border-blue-500 opacity-100' : 'border-transparent opacity-60'}`}
                                onClick={() => setActiveIndex(idx)}
                            >
                                <Image
                                    src={url}
                                    alt="Thumb"
                                    preview={false}
                                    // 🌟 QUAN TRỌNG: draggable={false} để không bị dính chuột khi kéo list
                                    draggable={false}
                                    className="pointer-events-none" // Chặn sự kiện chuột trực tiếp trên ảnh để div cha xử lý mượt hơn
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </Image.PreviewGroup>
        </div>
    );
}