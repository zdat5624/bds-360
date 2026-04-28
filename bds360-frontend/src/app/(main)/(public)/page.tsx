// @/app/(main)/(public)/page.tsx
"use client";

import { PostFilterParams } from "@/features/posts/api/types";
import { ForYouPosts } from "@/features/posts/components/for-you-posts";
import { HeroSmartFilterBar } from "@/features/posts/components/hero-smart-filter-bar";
import { VipPackagesList } from "@/features/vips";
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
            <section className="relative w-full h-[480px] flex items-center justify-center text-white overflow-visible">
                <div
                    className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
                    style={{
                        backgroundImage: "url('/images/banner-real-estate.png')",
                    }}
                />
                <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide text-[#1677ff] drop-shadow-md">
                        BDS360
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm md:text-base font-medium">
                        Nền tảng bất động sản thông minh
                    </p>
                </div>

                <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/40 via-white/10 to-white/40" />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-full max-w-2xl px-4">
                    <HeroSmartFilterBar
                        initialFilters={{ type: 'SALE' }}
                        onApply={handleApplyFilters}
                    />
                </div>
            </section>

            <div className="h-4"></div>

            <section className="container max-w-[1100px] mx-auto px-4 py-12 pt-0">
                <div className="flex flex-col gap-4">
                    <ForYouPosts
                        type="SALE"
                        title="Bất động sản dành cho bạn"
                    />

                    <ForYouPosts
                        type="RENT"
                        title="Nhà đất cho thuê dành cho bạn"
                    />
                </div>
            </section>

            <section className="container max-w-[1100px] mx-auto px-4 py-12 pt-0">
                <VipPackagesList />
            </section>
        </div>
    );
}