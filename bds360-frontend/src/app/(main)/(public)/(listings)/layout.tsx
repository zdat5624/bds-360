// @/app/(main)/(public)/(listings)/layout.tsx
'use client';

import { Footer } from '@/components/layouts/footer';
import { useUIStore } from '@/stores/ui.store';
import { HeatMapOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ReactNode, useState } from 'react';

export default function ListingsLayout({ children }: { children: ReactNode }) {
    const isMapView = useUIStore((state) => state.isMapView);
    const [isMobileMapOpen, setIsMobileMapOpen] = useState(false);

    // ==============================================================
    // CHẾ ĐỘ 1: XEM DANH SÁCH BÌNH THƯỜNG
    // ==============================================================
    if (!isMapView) {
        return (
            //  Sửa ở đây: Bỏ overflow-y-auto, dùng min-h để đẩy Footer xuống đáy nội dung
            <main className="flex flex-col w-full min-h-[calc(100vh-55px)] bg-gray-50">
                <div className="flex-1 container mx-auto px-4 py-8">
                    {children}
                </div>
                <div className="bg-white border-t border-gray-200 shrink-0">
                    <Footer />
                </div>
            </main>
        );
    }

    // ==============================================================
    // CHẾ ĐỘ 2: MAP VIEW (Chia 2 cột)
    // ==============================================================
    return (
        <main
            className="flex flex-row w-full overflow-hidden bg-white relative"
            style={{ height: 'calc(100vh - 55px)' }}
        >
            {/* BOX TRÁI (DANH SÁCH) */}
            <div className={`
                w-full lg:w-[55%] xl:w-[50%] h-full flex flex-col border-r border-gray-200 bg-gray-50 
                overflow-y-auto /*  QUAN TRỌNG: Thêm overflow-y-auto vào đây để Box trái cuộn được */
                ${isMobileMapOpen ? 'hidden lg:flex' : 'flex'} 
            `}>
                <div className="flex-1">
                    {children}
                </div>

                <div className="border-t border-gray-200 bg-white shrink-0">
                    <Footer />
                </div>
            </div>

            {/* BOX PHẢI (MAP) */}
            <div className={`
                flex-1 h-full bg-slate-200 relative items-center justify-center
                ${isMobileMapOpen ? 'flex' : 'hidden lg:flex'}
            `}>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-400">MAPBOX COMPONENT</h2>
                </div>
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button shape="circle" size="large">🗺️</Button>
                    <Button shape="circle" size="large">📍</Button>
                </div>
            </div>

            {/* NÚT NỔI MOBILE */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:hidden z-50 shadow-2xl">
                <Button
                    type="primary"
                    shape="round"
                    size="large"
                    icon={isMobileMapOpen ? <UnorderedListOutlined /> : <HeatMapOutlined />}
                    onClick={() => setIsMobileMapOpen(!isMobileMapOpen)}
                    className="bg-gray-800 text-white font-bold h-12 px-6"
                >
                    {isMobileMapOpen ? 'Xem danh sách' : 'Xem bản đồ'}
                </Button>
            </div>
        </main>
    );
}