// @/features/posts/components/smart-filter-bar.tsx
'use client';

import { FilterIcon, SearchIcon } from '@/components/icons/custom-icons';
import { SEARCH_SUGGESTIONS } from '@/constants/search-suggestions';
import { useGetDistricts, useGetProvinces, useGetWards } from '@/features/addresses/api/addresses.queries';
import { PostFilterParams } from '@/features/posts/api/types';
import { useEffect, useRef, useState } from 'react';
import { FilterModal } from './filter-modal';
import { FilterTags } from './filter-tags';

interface SmartFilterBarProps {
    initialFilters: Partial<PostFilterParams>;
    onApply: (filters: Partial<PostFilterParams>) => void;
    showTags?: boolean;
}

export function SmartFilterBar({ initialFilters, onApply, showTags = true }: SmartFilterBarProps) {
    const [inputValue, setInputValue] = useState(initialFilters.search || '');
    const [appliedKeyword, setAppliedKeyword] = useState(initialFilters.search || '');
    const [appliedFilters, setAppliedFilters] = useState<Partial<PostFilterParams>>(initialFilters);
    const [draftFilters, setDraftFilters] = useState<Partial<PostFilterParams>>(initialFilters);

    useEffect(() => {
        setAppliedFilters(initialFilters);
        setDraftFilters(initialFilters);
        setInputValue(initialFilters.search || '');
        setAppliedKeyword(initialFilters.search || '');
    }, [initialFilters]);

    const [showSuggestions, setShowSuggestions] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [tempProvince, setTempProvince] = useState<number | undefined>(appliedFilters.provinceCode);
    const [tempDistrict, setTempDistrict] = useState<number | undefined>(appliedFilters.districtCode);

    // Lấy thêm trạng thái isLoading từ React Query
    const { data: provinces, isLoading: isProvincesLoading } = useGetProvinces();
    const { data: districts, isLoading: isDistrictsLoading } = useGetDistricts(tempProvince);
    const { data: wards, isLoading: isWardsLoading } = useGetWards(tempDistrict);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredSuggestions = SEARCH_SUGGESTIONS
        .filter(item => item.label.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 6);

    const handleCommitSearch = (keyword: string = inputValue) => {
        setShowSuggestions(false);
        setAppliedKeyword(keyword);
        const newFilters = { ...appliedFilters, search: keyword || undefined };

        if (keyword) newFilters.searchBy = ['title', 'description'];
        else delete newFilters.searchBy;

        setAppliedFilters(newFilters);
        onApply(newFilters);
    };

    const handleApplyModalFilters = () => {
        setIsModalOpen(false);
        setAppliedFilters(draftFilters);

        const finalFilters = { ...draftFilters };
        if (appliedKeyword) {
            finalFilters.search = appliedKeyword;
            finalFilters.searchBy = ['title', 'description'];
        }

        onApply(finalFilters);
    };

    const handleRemoveTags = (keysToRemove: (keyof PostFilterParams | 'search')[]) => {
        const newFilters = { ...appliedFilters };
        let isKeywordCleared = false;

        keysToRemove.forEach(key => {
            if (key === 'search') {
                isKeywordCleared = true;
                delete newFilters.search;
                delete newFilters.searchBy;
            } else {
                delete newFilters[key as keyof PostFilterParams];
            }
        });

        if (isKeywordCleared) {
            setAppliedKeyword('');
            setInputValue('');
        }

        setAppliedFilters(newFilters);
        setDraftFilters(newFilters);
        onApply(newFilters);
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (appliedFilters.provinceCode) count++;
        if (appliedFilters.minPrice || appliedFilters.maxPrice) count++;
        if (appliedFilters.minArea || appliedFilters.maxArea) count++;
        if (appliedFilters.bedrooms) count++;
        if (appliedFilters.bathrooms) count++;
        if (appliedFilters.houseDirection) count++;
        if (appliedFilters.balconyDirection) count++;
        if (appliedFilters.legalStatus) count++;
        if (appliedFilters.furnishing) count++;
        return count;
    };

    const getAppliedLocationLabel = () => {
        // Đảm bảo không render Tag nếu đang load API
        if (isProvincesLoading || isDistrictsLoading || isWardsLoading) return null;

        const provinceName = provinces?.find(p => p.code === appliedFilters.provinceCode)?.name;
        const districtName = districts?.find(d => d.code === appliedFilters.districtCode)?.name;
        const wardName = wards?.find(w => w.code === appliedFilters.wardCode)?.name;

        if (wardName && districtName) return `${wardName}, ${districtName}`;
        if (districtName && provinceName) return `${districtName}, ${provinceName}`;
        if (provinceName) return provinceName;
        return null;
    };

    const activeCount = getActiveFiltersCount();
    const hasAnyFilter = activeCount > 0 || appliedKeyword;

    return (
        <div className="w-full flex flex-col gap-3">
            <div className="flex items-center relative" ref={dropdownRef}>
                <div className="flex-1 flex items-center bg-white border border-gray-300 focus-within:border-[#1677ff] focus-within:ring-1 focus-within:ring-[#1677ff] rounded-lg p-1.5 shadow-sm transition-all h-[46px]">
                    <div className="pl-2 pr-1.5 text-gray-400"><SearchIcon /></div>
                    <input type="text" value={inputValue} onChange={(e) => { setInputValue(e.target.value); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} onKeyDown={(e) => e.key === 'Enter' && handleCommitSearch()} placeholder="Tìm kiếm khu vực, dự án, tiện ích..." className="flex-1 bg-transparent border-none outline-none py-1 text-gray-800 placeholder-gray-400 text-[0.9rem] w-full" />
                    {inputValue && <button onClick={() => { setInputValue(''); setShowSuggestions(false); }} className="text-gray-400 hover:text-gray-600 px-3">✕</button>}
                    <button onClick={() => handleCommitSearch()} className="hidden sm:flex items-center justify-center px-6 h-full bg-[#1677ff] hover:bg-blue-600 text-white font-medium rounded-md shadow-sm transition-colors text-[0.9rem] shrink-0">Tìm kiếm</button>
                </div>

                <button onClick={() => { setDraftFilters(appliedFilters); setIsModalOpen(true); }} className="relative flex items-center justify-center gap-2 px-5 bg-white border border-gray-300 hover:bg-gray-50 hover:border-[#1677ff] hover:text-[#1677ff] text-gray-700 font-medium rounded-lg shadow-sm transition-all shrink-0 ml-3 h-[46px]">
                    <FilterIcon />
                    <span className="hidden sm:inline text-[0.9rem]">Bộ lọc</span>
                    {activeCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-[#e03c31] text-white text-[0.65rem] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                            {activeCount}
                        </span>
                    )}
                </button>

                {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
                    <div className="absolute top-[110%] left-0 w-full sm:w-[calc(100%-120px)] bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2 text-[0.7rem] font-semibold text-gray-400 uppercase tracking-wider">Từ khóa gợi ý</div>
                        {filteredSuggestions.map((item, idx) => (
                            <div key={idx} onClick={() => handleCommitSearch(item.label)} className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center gap-3 text-gray-700 transition-colors text-[0.85rem]"><SearchIcon /><span>{item.label}</span></div>
                        ))}
                    </div>
                )}
            </div>

            {/* Render tags chỉ khi không vướng mắc quá trình tải API địa chỉ */}
            {showTags && hasAnyFilter && !(isProvincesLoading || isDistrictsLoading || isWardsLoading) && (
                <div className="flex flex-wrap items-center gap-2 animate-in fade-in duration-300">
                    <FilterTags
                        appliedKeyword={appliedKeyword}
                        appliedFilters={appliedFilters}
                        locationLabel={getAppliedLocationLabel()}
                        onRemoveTags={handleRemoveTags}
                    />

                    <button
                        onClick={() => {
                            setInputValue('');
                            setAppliedKeyword('');
                            const reset = { type: appliedFilters.type || 'RENT' };
                            setAppliedFilters(reset);
                            setDraftFilters(reset);
                            onApply(reset);
                        }}
                        className="text-[0.8rem] text-red-500 hover:text-red-700 font-medium px-2 py-1 underline underline-offset-2 transition-colors shrink-0"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            )}

            <FilterModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                draftFilters={draftFilters}
                setDraftFilters={setDraftFilters}
                onApply={handleApplyModalFilters}
                provinces={provinces}
                districts={districts}
                wards={wards}
                setTempLocation={(prov, dist) => {
                    setTempProvince(prov);
                    setTempDistrict(dist);
                }}
            />
        </div>
    );
}