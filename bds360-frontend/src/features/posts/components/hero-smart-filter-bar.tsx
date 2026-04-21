// @/features/posts/components/hero-smart-filter-bar.tsx
'use client';

import { FilterIcon, SearchIcon } from '@/components/icons/custom-icons';
import { LISTING_TYPE_LABEL, LISTING_TYPE_VALUES, type ListingType } from '@/constants/listing.constant';
import { SEARCH_SUGGESTIONS } from '@/constants/search-suggestions';
import { useGetDistricts, useGetProvinces, useGetWards } from '@/features/addresses/api/addresses.queries';
import { PostFilterParams } from '@/features/posts/api/types';
import { useEffect, useRef, useState } from 'react';
import { FilterModal } from './filter-modal';

interface HeroSmartFilterBarProps {
    initialFilters: Partial<PostFilterParams>;
    onApply: (filters: Partial<PostFilterParams>) => void;
    placeholder?: string;
    className?: string;
}

export function HeroSmartFilterBar({
    initialFilters,
    onApply,
    placeholder = 'Nhập từ khóa tìm kiếm...',
    className = '',
}: HeroSmartFilterBarProps) {
    const [inputValue, setInputValue] = useState(initialFilters.search || '');
    const [appliedFilters, setAppliedFilters] = useState<Partial<PostFilterParams>>(initialFilters);
    const [draftFilters, setDraftFilters] = useState<Partial<PostFilterParams>>(initialFilters);
    const [currentType, setCurrentType] = useState<ListingType>((initialFilters.type as ListingType) || 'SALE');

    const [showSuggestions, setShowSuggestions] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Local state để Modal load địa chỉ chính xác
    const [tempProvince, setTempProvince] = useState<number | undefined>(appliedFilters.provinceCode);
    const [tempDistrict, setTempDistrict] = useState<number | undefined>(appliedFilters.districtCode);

    const { data: provinces } = useGetProvinces();
    const { data: districts } = useGetDistricts(tempProvince);
    const { data: wards } = useGetWards(tempDistrict);

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

    const handleTabChange = (type: ListingType) => {
        setCurrentType(type);
        setAppliedFilters(prev => ({ ...prev, type }));
    };

    // 🌟 CHỈ CHUYỂN TRANG KHI BẤM NÚT NÀY
    const handleCommitSearch = (keyword: string = inputValue) => {
        setShowSuggestions(false);
        const finalFilters = {
            ...appliedFilters,
            type: currentType,
            search: keyword.trim() || undefined,
            searchBy: keyword.trim() ? ['title', 'description'] : undefined
        };
        onApply(finalFilters);
    };

    // 🌟 BẤM TRONG MODAL CHỈ LÀ LƯU TẠM (KHÔNG CHUYỂN TRANG)
    const handleApplyModalFilters = () => {
        setIsModalOpen(false);
        setAppliedFilters(draftFilters);
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        const f = appliedFilters;
        if (f.provinceCode) count++;
        if (f.minPrice || f.maxPrice) count++;
        if (f.minArea || f.maxArea) count++;
        if (f.bedrooms) count++;
        if (f.bathrooms) count++;
        if (f.houseDirection || f.balconyDirection) count++;
        if (f.legalStatus || f.furnishing) count++;
        return count;
    };

    const tabOptions = LISTING_TYPE_VALUES.map((value) => ({
        value,
        label: LISTING_TYPE_LABEL[value],
    }));

    return (
        <div className={`w-full ${className}`}>
            <div className="bg-black/30 backdrop-blur-md p-2 md:p-3 rounded-xl border-none flex flex-col gap-4">

                {/* TABS CĂN GIỮA */}
                <div className="flex items-center justify-center gap-4 md:gap-8">
                    {tabOptions.map((tab) => {
                        const isActive = currentType === tab.value;
                        return (
                            <button
                                key={tab.value}
                                onClick={() => handleTabChange(tab.value)}
                                className={`pb-2 text-[1rem] font-semibold transition-all border-b-2 min-w-[80px] ${isActive
                                    ? 'border-[#1677ff] text-white'
                                    : 'border-transparent text-white/60 hover:text-white'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* THANH SEARCH */}
                <div className="flex items-center relative" ref={dropdownRef}>
                    <div className="flex-1 flex items-center bg-white rounded-xl p-1.5 h-[52px] shadow-inner">
                        <div className="pl-3 pr-2 text-gray-400"><SearchIcon className="w-5 h-5" /></div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => { setInputValue(e.target.value); setShowSuggestions(true); }}
                            onFocus={() => setShowSuggestions(true)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCommitSearch()}
                            placeholder={placeholder}
                            className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-[1rem] w-full"
                        />
                        {inputValue && (
                            <button onClick={() => { setInputValue(''); setShowSuggestions(false); }} className="text-gray-400 hover:text-gray-600 px-2">✕</button>
                        )}
                        <button
                            onClick={() => handleCommitSearch()}
                            className="hidden sm:flex items-center justify-center px-6 h-full bg-[#1677ff] hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shrink-0"
                        >
                            Tìm kiếm
                        </button>
                    </div>

                    <button
                        onClick={() => { setDraftFilters(appliedFilters); setIsModalOpen(true); }}
                        className="relative flex items-center justify-center gap-2 px-4 md:px-6 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl ml-3 h-[52px] shadow-md shrink-0"
                    >
                        <FilterIcon className="w-5 h-5" />
                        <span className="hidden md:inline">Bộ lọc</span>
                        {getActiveFiltersCount() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#e03c31] text-white text-[0.7rem] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                {getActiveFiltersCount()}
                            </span>
                        )}
                    </button>

                    {/* SUGGESTIONS */}
                    {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
                        <div className="absolute top-[calc(100%+8px)] left-0 w-full sm:w-[calc(100%-120px)] bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {filteredSuggestions.map((item, idx) => (
                                <div key={idx} onClick={() => { setInputValue(item.label); handleCommitSearch(item.label); }} className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 text-gray-700 transition-colors text-[0.9rem]"><SearchIcon className="w-4 h-4 text-gray-400" /><span>{item.label}</span></div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

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