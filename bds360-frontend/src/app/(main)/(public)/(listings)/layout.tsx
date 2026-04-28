// File: @/app/(main)/(public)/(listings)/layout.tsx
'use client';

import { Footer } from '@/components/layouts/footer';
import { PostsMap } from '@/features/posts/components/posts-map';
import { usePostFilterUrl } from '@/features/posts/hooks/use-post-filter-url';
import { useUIStore } from '@/stores/ui.store';
import { HeatMapOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button, Skeleton } from 'antd';
import { usePathname, useSearchParams } from 'next/navigation';
import { ReactNode, Suspense, useState } from 'react';

function ListingsLayoutContent({ children }: { children: ReactNode }) {
    const isMapView = useUIStore((state) => state.isMapView);
    const [isMobileMapOpen, setIsMobileMapOpen] = useState(false);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentType = (searchParams.get('type') as 'RENT' | 'SALE')
        || (pathname.includes('/sale') ? 'SALE' : 'RENT');

    const { filters } = usePostFilterUrl(currentType);

    if (!isMapView) {
        return (
            <main className="flex flex-col w-full min-h-[calc(100vh-55px)] bg-gray-50">
                <div className="flex-1 container mx-auto px-4 py-8">{children}</div>
                <div className="bg-white border-t border-gray-200 shrink-0"><Footer /></div>
            </main>
        );
    }

    return (
        <main
            className="flex flex-row w-full overflow-hidden bg-white relative"
            style={{ height: 'calc(100vh - 55px)' }}
        >
            {/* BOX TRÁI (DANH SÁCH) - Set % chiều rộng cụ thể */}
            <div className={`
                h-full flex flex-col border-r border-gray-200 bg-gray-50 
                overflow-y-auto shrink-0
                w-full lg:w-[55%] xl:w-[50%]
                ${isMobileMapOpen ? 'hidden lg:flex' : 'flex'} 
            `}>
                <div className="flex-1">{children}</div>
                <div className="border-t border-gray-200 bg-white shrink-0"><Footer /></div>
            </div>

            {/* BOX PHẢI (MAP) - Dùng block và w-full để chống vỡ canvas */}
            <div className={`
                h-full bg-slate-200 relative shrink-0
                w-full lg:w-[45%] xl:w-[50%]
                ${isMobileMapOpen ? 'block' : 'hidden lg:block'}
            `}>
                <PostsMap isMobileMapOpen={isMobileMapOpen} filters={filters} />
            </div>

            {/* NÚT NỔI MOBILE */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:hidden z-50 shadow-2xl">
                <Button
                    type="primary"
                    shape="round"
                    size="large"
                    icon={isMobileMapOpen ? <UnorderedListOutlined /> : <HeatMapOutlined />}
                    onClick={() => setIsMobileMapOpen(!isMobileMapOpen)}
                    className="bg-gray-800 text-white font-bold h-12 px-6 border-none hover:bg-gray-700"
                >
                    {isMobileMapOpen ? 'Xem danh sách' : 'Xem bản đồ'}
                </Button>
            </div>
        </main>
    );
}

export default function ListingsLayout({ children }: { children: ReactNode }) {
    return (
        <Suspense
            fallback={
                <div className="w-full min-h-[calc(100vh-55px)] flex flex-col p-8 bg-gray-50">
                    <Skeleton active paragraph={{ rows: 10 }} />
                </div>
            }
        >
            <ListingsLayoutContent>{children}</ListingsLayoutContent>
        </Suspense>
    );
}