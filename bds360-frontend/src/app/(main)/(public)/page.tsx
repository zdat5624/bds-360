// @/app/(main)/(public)/page.tsx
export default function HomePage() {
    return (
        <div className="w-full">
            {/* 1. KHU VỰC TRÀN VIỀN (Hero Banner) */}
            <section className="w-full bg-blue-900 h-[400px] flex items-center justify-center text-white">
                <h1 className="text-4xl font-bold">Banner Tràn Viền Tuyệt Đẹp</h1>
            </section>

            {/* 2. KHU VỰC GOM VÀO GIỮA (Danh sách BDS) */}
            <section className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-semibold mb-6">Tin đăng mới nhất</h2>
                <div className="grid grid-cols-4 gap-4">
                    {/* Các Card Bất động sản của bạn */}
                    <div className="h-64 bg-slate-100 rounded-lg border"></div>
                    <div className="h-64 bg-slate-100 rounded-lg border"></div>
                    <div className="h-64 bg-slate-100 rounded-lg border"></div>
                    <div className="h-64 bg-slate-100 rounded-lg border"></div>
                </div>
            </section>

            {/* 3. LẠI MỘT KHU VỰC TRÀN VIỀN KHÁC (Banner quảng cáo) */}
            <section className="w-full bg-amber-100 py-10 text-center">
                <h3 className="text-xl">Quảng cáo tràn màn hình</h3>
            </section>
        </div>
    );
}