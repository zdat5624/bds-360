// @/features/posts/components/filter-tags.tsx
import { PostFilterParams } from '@/features/posts/api/types';

interface FilterTagsProps {
    appliedKeyword: string;
    appliedFilters: Partial<PostFilterParams>;
    locationLabel?: string | null;
    onRemoveTags: (keys: (keyof PostFilterParams | 'search')[]) => void;
}

export function FilterTags({ appliedKeyword, appliedFilters, locationLabel, onRemoveTags }: FilterTagsProps) {
    const hasTags = appliedKeyword || appliedFilters.provinceCode || appliedFilters.bedrooms || appliedFilters.bathrooms || appliedFilters.minPrice || appliedFilters.maxPrice || appliedFilters.minArea || appliedFilters.maxArea;

    if (!hasTags) return null;

    // 🌟 TRẢ VỀ FRAGMENT ĐỂ CÁC TAGS TRÀN RA CÙNG CẤP VỚI NÚT "XÓA BỘ LỌC"
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

            {appliedFilters.bedrooms && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-[0.8rem] font-medium shadow-sm">
                    Phòng ngủ: {appliedFilters.bedrooms}
                    <button onClick={() => onRemoveTags(['bedrooms'])} className="hover:bg-gray-200 text-gray-500 rounded-full w-4 h-4 flex items-center justify-center ml-1 transition-colors">✕</button>
                </span>
            )}

            {appliedFilters.bathrooms && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-[0.8rem] font-medium shadow-sm">
                    Vệ sinh: {appliedFilters.bathrooms}
                    <button onClick={() => onRemoveTags(['bathrooms'])} className="hover:bg-gray-200 text-gray-500 rounded-full w-4 h-4 flex items-center justify-center ml-1 transition-colors">✕</button>
                </span>
            )}

            {(appliedFilters.minPrice || appliedFilters.maxPrice) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-[0.8rem] font-medium shadow-sm">
                    Giá: {appliedFilters.minPrice || 0} - {appliedFilters.maxPrice || 'Max'} Tr
                    <button onClick={() => onRemoveTags(['minPrice', 'maxPrice'])} className="hover:bg-gray-200 text-gray-500 rounded-full w-4 h-4 flex items-center justify-center ml-1 transition-colors">✕</button>
                </span>
            )}

            {(appliedFilters.minArea || appliedFilters.maxArea) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-[0.8rem] font-medium shadow-sm">
                    Diện tích: {appliedFilters.minArea || 0} - {appliedFilters.maxArea || 'Max'} m²
                    <button onClick={() => onRemoveTags(['minArea', 'maxArea'])} className="hover:bg-gray-200 text-gray-500 rounded-full w-4 h-4 flex items-center justify-center ml-1 transition-colors">✕</button>
                </span>
            )}
        </>
    );
}