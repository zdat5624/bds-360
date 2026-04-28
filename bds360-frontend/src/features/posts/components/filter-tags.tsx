// @/features/posts/components/filter-tags.tsx
import { PostFilterParams } from '@/features/posts/api/types';
import { formatCompactMoney } from '@/utils/number.util';

interface FilterTagsProps {
    appliedKeyword: string;
    appliedFilters: Partial<PostFilterParams>;
    locationLabel?: string | null;
    onRemoveTags: (keys: (keyof PostFilterParams | 'search')[]) => void;
}

export function FilterTags({ appliedKeyword, appliedFilters, locationLabel, onRemoveTags }: FilterTagsProps) {
    // 🌟 Đã cập nhật `hasTags` để quét toàn bộ các trường filter
    const hasTags =
        appliedKeyword ||
        appliedFilters.provinceCode ||
        appliedFilters.bedrooms ||
        appliedFilters.bathrooms ||
        appliedFilters.minPrice ||
        appliedFilters.maxPrice ||
        appliedFilters.minArea ||
        appliedFilters.maxArea ||
        appliedFilters.houseDirection ||
        appliedFilters.balconyDirection ||
        appliedFilters.legalStatus ||
        appliedFilters.furnishing;

    if (!hasTags) return null;

    // Helper map data để hiển thị đẹp hơn
    const directionLabels: Record<string, string> = {
        NORTH: 'Bắc', NORTHEAST: 'Đông Bắc', EAST: 'Đông', SOUTHEAST: 'Đông Nam',
        SOUTH: 'Nam', SOUTHWEST: 'Tây Nam', WEST: 'Tây', NORTHWEST: 'Tây Bắc'
    };

    const legalLabels: Record<string, string> = {
        PINK_BOOK: 'Sổ đỏ/Sổ hồng', SALE_CONTRACT: 'HĐ mua bán', WAITING: 'Đang chờ sổ', OTHER: 'Khác'
    };

    const furnishingLabels: Record<string, string> = {
        FULLY_FURNISHED: 'Đầy đủ', BASIC: 'Cơ bản', UNFURNISHED: 'Không nội thất', OTHER: 'Khác'
    };

    return (
        <>
            {appliedKeyword && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e6f4ff] text-[#1677ff] border border-[#91caff] rounded-md text-[0.8rem] font-medium shadow-sm">
                    Từ khóa: {appliedKeyword}
                    <button onClick={() => onRemoveTags(['search'])} className="hover:bg-blue-200 text-[#1677ff] rounded-full w-4 h-4 flex items-center justify-center ml-1 transition-colors">✕</button>
                </span>
            )}

            {appliedFilters.provinceCode && locationLabel && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-[0.8rem] font-medium shadow-sm">
                    Khu vực: {locationLabel}
                    <button onClick={() => onRemoveTags(['provinceCode', 'districtCode', 'wardCode'])} className="hover:bg-gray-200 text-gray-500 rounded-full w-4 h-4 flex items-center justify-center ml-1 transition-colors">✕</button>
                </span>
            )}

            {(appliedFilters.minPrice || appliedFilters.maxPrice) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-[0.8rem] font-medium shadow-sm">
                    Giá: {(() => {
                        const minStr = formatCompactMoney(appliedFilters.minPrice);
                        const maxStr = formatCompactMoney(appliedFilters.maxPrice);

                        if (minStr && maxStr) return `${minStr} - ${maxStr}`;
                        if (minStr) return `Trên ${minStr}`;
                        if (maxStr) return `Dưới ${maxStr}`;
                        return 'Tất cả';
                    })()}
                    <button onClick={() => onRemoveTags(['minPrice', 'maxPrice'])} className="...">✕</button>
                </span>
            )}

            {(appliedFilters.minArea || appliedFilters.maxArea) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-[0.8rem] font-medium shadow-sm">
                    Diện tích: {appliedFilters.minArea || 0} - {appliedFilters.maxArea || 'Max'} m²
                    <button onClick={() => onRemoveTags(['minArea', 'maxArea'])} className="hover:bg-gray-200 text-gray-500 rounded-full w-4 h-4 flex items-center justify-center ml-1 transition-colors">✕</button>
                </span>
            )}

            {appliedFilters.bedrooms && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-[0.8rem] font-medium shadow-sm">
                    Phòng ngủ: {appliedFilters.bedrooms === 5 ? '5+' : appliedFilters.bedrooms}
                    <button onClick={() => onRemoveTags(['bedrooms'])} className="hover:bg-gray-200 text-gray-500 rounded-full w-4 h-4 flex items-center justify-center ml-1 transition-colors">✕</button>
                </span>
            )}

            {appliedFilters.bathrooms && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-[0.8rem] font-medium shadow-sm">
                    Vệ sinh: {appliedFilters.bathrooms === 5 ? '5+' : appliedFilters.bathrooms}
                    <button onClick={() => onRemoveTags(['bathrooms'])} className="hover:bg-gray-200 text-gray-500 rounded-full w-4 h-4 flex items-center justify-center ml-1 transition-colors">✕</button>
                </span>
            )}

            {/* 🌟 CÁC TRƯỜNG MỚI ĐƯỢC THÊM VÀO */}
            {appliedFilters.houseDirection && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-[0.8rem] font-medium shadow-sm">
                    Hướng nhà: {directionLabels[appliedFilters.houseDirection as string] || appliedFilters.houseDirection}
                    <button onClick={() => onRemoveTags(['houseDirection'])} className="hover:bg-gray-200 text-gray-500 rounded-full w-4 h-4 flex items-center justify-center ml-1 transition-colors">✕</button>
                </span>
            )}

            {appliedFilters.balconyDirection && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-[0.8rem] font-medium shadow-sm">
                    Hướng ban công: {directionLabels[appliedFilters.balconyDirection as string] || appliedFilters.balconyDirection}
                    <button onClick={() => onRemoveTags(['balconyDirection'])} className="hover:bg-gray-200 text-gray-500 rounded-full w-4 h-4 flex items-center justify-center ml-1 transition-colors">✕</button>
                </span>
            )}

            {appliedFilters.legalStatus && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-[0.8rem] font-medium shadow-sm">
                    Pháp lý: {legalLabels[appliedFilters.legalStatus as string] || appliedFilters.legalStatus}
                    <button onClick={() => onRemoveTags(['legalStatus'])} className="hover:bg-gray-200 text-gray-500 rounded-full w-4 h-4 flex items-center justify-center ml-1 transition-colors">✕</button>
                </span>
            )}

            {appliedFilters.furnishing && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-[0.8rem] font-medium shadow-sm">
                    Nội thất: {furnishingLabels[appliedFilters.furnishing as string] || appliedFilters.furnishing}
                    <button onClick={() => onRemoveTags(['furnishing'])} className="hover:bg-gray-200 text-gray-500 rounded-full w-4 h-4 flex items-center justify-center ml-1 transition-colors">✕</button>
                </span>
            )}
        </>
    );
}