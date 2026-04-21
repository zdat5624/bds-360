// File: @/app/(main)/(public)/page.tsx
"use client";

import { PostFilterParams } from "@/features/posts/api/types";
import { HeroSmartFilterBar } from "@/features/posts/components/hero-smart-filter-bar";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();

    const handleApplyFilters = (filters: Partial<PostFilterParams>) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    value.forEach(v => params.append(key, String(v)));
                } else {
                    params.set(key, String(value));
                }
            }
        });
        const targetPage = filters.type === 'SALE' ? '/sale' : '/rent';
        router.push(`${targetPage}?${params.toString()}`);
    };

    return (
        <div className="w-full">
            {/* HERO SECTION */}
            <section className="relative w-full h-[480px] flex items-center justify-center text-white overflow-visible">
                {/* 🖼️ Background Image */}
                <div
                    className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
                    style={{
                        backgroundImage: "url('/images/banner-real-estate.png')", // 👈 đổi tên file của bạn
                    }}
                />
                {/* 🏷️ BRAND NAME */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide text-[#1677ff] drop-shadow-md">
                        BDS360
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm md:text-base font-medium">
                        Nền tảng bất động sản thông minh
                    </p>
                </div>

                {/* 🌫️ Overlay để dễ đọc UI */}
                {/* <div className="absolute inset-0 z-10 bg-white/20" /> */}
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/40 via-white/10 to-white/40" />

                {/* 🌟 FILTER BAR */}
                <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-full max-w-2xl px-4">


                    <HeroSmartFilterBar
                        initialFilters={{ type: 'SALE' }}
                        onApply={handleApplyFilters}
                    />
                </div>
            </section>

            {/* SPACER: Để nội dung bên dưới không bị che lấp bởi FilterBar đang nổi */}
            <div className="h-32 md:h-40"></div>

            {/* CONTENT SECTION */}
            <section className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Tin đăng mới nhất</h2>
                    <button className="text-[#1677ff] font-medium hover:underline">Xem thêm</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-80 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"></div>
                    ))}
                </div>
            </section>
        </div>
    );
}