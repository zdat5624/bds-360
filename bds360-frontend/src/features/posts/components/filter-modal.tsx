// @/features/posts/components/filter-modal.tsx
import { AppModal } from '@/components/base/app.modal';
import { AreaIcon, ArrowLeftIcon, ChevronRightIcon, LocationIcon, MoneyIcon } from '@/components/icons/custom-icons';
import { PostFilterParams } from '@/features/posts/api/types';
import { Furnishing, LegalStatus } from '@/features/posts/posts.constant';
import { formatCompactMoney } from '@/utils/number.util';
import { Select, Slider } from 'antd';
import React, { useEffect, useState } from 'react';
import { CompassSelector } from './compass-selector';

type ModalView = 'MAIN' | 'LOCATION' | 'PRICE' | 'AREA';
export interface AddressItem {
    code: number;
    name: string;
}
interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    draftFilters: Partial<PostFilterParams>;
    setDraftFilters: (filters: Partial<PostFilterParams>) => void;
    onApply: () => void;
    // ✅ FIX: Thay any[] bằng AddressItem[]
    provinces?: AddressItem[];
    districts?: AddressItem[];
    wards?: AddressItem[];
    currentProvince?: number;
    currentDistrict?: number;
    setTempLocation: (province?: number, district?: number) => void;
}

export function FilterModal({ isOpen, onClose, draftFilters, setDraftFilters, onApply, provinces, districts, wards, setTempLocation }: FilterModalProps) {
    const [activeView, setActiveView] = useState<ModalView>('MAIN');
    const [tempFilters, setTempFilters] = useState<Partial<PostFilterParams>>({});

    // Cập nhật temp location cho component cha mỗi khi tempFilters thay đổi (khi đang ở view con)
    useEffect(() => {
        if (activeView === 'LOCATION') {
            setTempLocation(tempFilters.provinceCode, tempFilters.districtCode);
        } else {
            setTempLocation(draftFilters.provinceCode, draftFilters.districtCode);
        }
    }, [activeView, tempFilters.provinceCode, tempFilters.districtCode, draftFilters.provinceCode, draftFilters.districtCode, setTempLocation]);

    // Các hàm điều khiển luồng trong Modal
    const openNestedView = (view: ModalView) => {
        setTempFilters(draftFilters);
        setActiveView(view);
    };

    const cancelNestedView = () => {
        setActiveView('MAIN');
    };

    const applyNestedView = () => {
        setDraftFilters(tempFilters);
        setActiveView('MAIN');
    };

    const resetNestedView = () => {
        if (activeView === 'LOCATION') setTempFilters({ ...tempFilters, provinceCode: undefined, districtCode: undefined, wardCode: undefined });
        if (activeView === 'PRICE') setTempFilters({ ...tempFilters, minPrice: undefined, maxPrice: undefined });
        if (activeView === 'AREA') setTempFilters({ ...tempFilters, minArea: undefined, maxArea: undefined });
    };

    // Hàm tiện ích UI
    const FilterPill = ({ label, isActive, onClick, className = '' }: { label: string, isActive: boolean, onClick: () => void, className?: string }) => (
        <button type="button" onClick={onClick} className={`h-8 px-3 rounded-full border text-[0.75rem] transition-all duration-200 outline-none flex items-center justify-center whitespace-nowrap ${isActive ? 'bg-[#e6f4ff] text-[#1677ff] border-[#1677ff] font-medium' : 'bg-white text-gray-600 border-gray-300 hover:border-[#1677ff] hover:text-[#1677ff]'} ${className}`}>
            {label}
        </button>
    );

    const SelectRow = ({ icon, label, value, onClick }: { icon: React.ReactNode, label: string, value: string, onClick: () => void }) => (
        <div className="flex flex-col gap-1">
            <span className="text-[0.85rem] font-semibold text-gray-800">{label}</span>
            <button onClick={onClick} className="flex items-center justify-between w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-[#1677ff] hover:bg-blue-50/30 transition-colors text-left">
                <div className="flex items-center gap-2 text-gray-700 min-w-0">
                    <span className="text-gray-400 shrink-0">{icon}</span>
                    <span className={`text-[0.85rem] truncate ${value !== 'Tất cả' && value !== 'Trên toàn quốc' ? 'text-[#1677ff] font-medium' : 'text-gray-500'}`}>{value}</span>
                </div>
                <ChevronRightIcon />
            </button>
        </div>
    );

    const getSelectedLocationLabel = () => {
        const provinceName = provinces?.find(p => p.code === draftFilters.provinceCode)?.name;
        const districtName = districts?.find(d => d.code === draftFilters.districtCode)?.name;
        const wardName = wards?.find(w => w.code === draftFilters.wardCode)?.name;

        if (wardName && districtName) return `${wardName}, ${districtName}`;
        if (districtName && provinceName) return `${districtName}, ${provinceName}`;
        if (provinceName) return provinceName;
        return 'Trên toàn quốc';
    };

    // =====================================
    // VIEWS RENDERERS
    // =====================================

    const renderMainView = () => (
        <div className="flex flex-col gap-5 p-1">
            <div className="flex p-1 bg-gray-100 rounded-lg">
                <button onClick={() => setDraftFilters({ ...draftFilters, type: 'SALE' })} className={`flex-1 py-1.5 text-center text-[0.85rem] font-semibold rounded-md transition-all ${draftFilters.type === 'SALE' ? 'bg-white text-gray-800 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>Tìm mua</button>
                <button onClick={() => setDraftFilters({ ...draftFilters, type: 'RENT' })} className={`flex-1 py-1.5 text-center text-[0.85rem] font-semibold rounded-md transition-all ${draftFilters.type === 'RENT' ? 'bg-white text-gray-800 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>Tìm thuê</button>
            </div>

            <SelectRow icon={<LocationIcon />} label="Khu vực & Dự án" value={getSelectedLocationLabel()} onClick={() => openNestedView('LOCATION')} />

            {/* <SelectRow
                icon={<MoneyIcon />}
                label="Khoảng giá"
                value={(draftFilters.minPrice || draftFilters.maxPrice) ? `${draftFilters.minPrice || 0} - ${draftFilters.maxPrice ? draftFilters.maxPrice + ' Tr' : 'Trở lên'}` : 'Tất cả'}
                onClick={() => openNestedView('PRICE')}
            /> */}

            <SelectRow
                icon={<MoneyIcon />}
                label="Khoảng giá"
                value={
                    (draftFilters.minPrice || draftFilters.maxPrice)
                        ? `${formatCompactMoney(draftFilters.minPrice) || 0} - ${draftFilters.maxPrice ? formatCompactMoney(draftFilters.maxPrice) : 'Trở lên'}`
                        : 'Tất cả'
                }
                onClick={() => openNestedView('PRICE')}
            />

            <SelectRow icon={<AreaIcon />} label="Diện tích" value={(draftFilters.minArea || draftFilters.maxArea) ? `${draftFilters.minArea || 0} - ${draftFilters.maxArea ? draftFilters.maxArea + ' m²' : 'Trở lên'}` : 'Tất cả'} onClick={() => openNestedView('AREA')} />

            <hr className="border-gray-100" />

            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-gray-800 font-semibold text-[0.85rem] mb-2.5">Số phòng ngủ</label>
                    <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <FilterPill key={num} label={num === 5 ? '5+' : num.toString()} isActive={draftFilters.bedrooms === num} onClick={() => setDraftFilters({ ...draftFilters, bedrooms: draftFilters.bedrooms === num ? undefined : num })} className="!w-9 !h-9 !p-0 !rounded-full text-[0.8rem]" />
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-gray-800 font-semibold text-[0.85rem] mb-2.5">Số phòng tắm, vệ sinh</label>
                    <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <FilterPill key={num} label={num === 5 ? '5+' : num.toString()} isActive={draftFilters.bathrooms === num} onClick={() => setDraftFilters({ ...draftFilters, bathrooms: draftFilters.bathrooms === num ? undefined : num })} className="!w-9 !h-9 !p-0 !rounded-full text-[0.8rem]" />
                        ))}
                    </div>
                </div>
            </div>

            <hr className="border-gray-100" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-hidden">
                <CompassSelector label="Hướng nhà" value={draftFilters.houseDirection} onChange={(val) => setDraftFilters({ ...draftFilters, houseDirection: val })} />
                <CompassSelector label="Hướng ban công" value={draftFilters.balconyDirection} onChange={(val) => setDraftFilters({ ...draftFilters, balconyDirection: val })} />
            </div>

            <hr className="border-gray-100" />

            <div className="flex flex-col gap-3">
                <label className="text-gray-800 font-semibold text-[0.85rem]">Pháp lý</label>
                <div className="flex flex-wrap gap-2">
                    {[{ val: 'PINK_BOOK', lbl: 'Sổ đỏ/Sổ hồng' }, { val: 'SALE_CONTRACT', lbl: 'Hợp đồng mua bán' }, { val: 'WAITING', lbl: 'Đang chờ sổ' }, { val: 'OTHER', lbl: 'Khác' }].map(item => (
                        <FilterPill key={item.val} label={item.lbl} isActive={draftFilters.legalStatus === item.val} onClick={() => setDraftFilters({ ...draftFilters, legalStatus: draftFilters.legalStatus === item.val ? undefined : item.val as LegalStatus })} />
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-3 pb-2">
                <label className="text-gray-800 font-semibold text-[0.85rem]">Nội thất</label>
                <div className="flex flex-wrap gap-2">
                    {[{ val: 'FULLY_FURNISHED', lbl: 'Đầy đủ' }, { val: 'BASIC', lbl: 'Cơ bản' }, { val: 'UNFURNISHED', lbl: 'Không nội thất' }, { val: 'OTHER', lbl: 'Khác' }].map(item => (
                        <FilterPill key={item.val} label={item.lbl} isActive={draftFilters.furnishing === item.val} onClick={() => setDraftFilters({ ...draftFilters, furnishing: draftFilters.furnishing === item.val ? undefined : item.val as Furnishing })} />
                    ))}
                </div>
            </div>
        </div>
    );

    const renderLocationView = () => {
        const provOptions = [{ label: 'Tất cả Tỉnh/Thành phố', value: '' }, ...(provinces?.map(p => ({ label: p.name, value: p.code })) || [])];
        const distOptions = [{ label: 'Tất cả Quận/Huyện', value: '' }, ...(districts?.map(d => ({ label: d.name, value: d.code })) || [])];
        const wardOptions = [{ label: 'Tất cả Phường/Xã', value: '' }, ...(wards?.map(w => ({ label: w.name, value: w.code })) || [])];

        return (
            <div className="flex flex-col gap-5 p-1 mt-2">
                <div className="flex flex-col gap-2">
                    <label className="text-[0.85rem] font-semibold text-gray-700">Tỉnh/Thành phố</label>
                    <Select showSearch placeholder="Chọn Tỉnh/Thành phố" optionFilterProp="label" value={tempFilters.provinceCode || ''} onChange={(val) => setTempFilters({ ...tempFilters, provinceCode: val ? Number(val) : undefined, districtCode: undefined, wardCode: undefined })} options={provOptions} className="w-full h-[42px]" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[0.85rem] font-semibold text-gray-700">Quận/Huyện</label>
                    <Select showSearch placeholder="Chọn Quận/Huyện" optionFilterProp="label" value={tempFilters.districtCode || ''} disabled={!tempFilters.provinceCode} onChange={(val) => setTempFilters({ ...tempFilters, districtCode: val ? Number(val) : undefined, wardCode: undefined })} options={distOptions} className="w-full h-[42px]" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[0.85rem] font-semibold text-gray-700">Phường/Xã</label>
                    <Select showSearch placeholder="Chọn Phường/Xã" optionFilterProp="label" value={tempFilters.wardCode || ''} disabled={!tempFilters.districtCode} onChange={(val) => setTempFilters({ ...tempFilters, wardCode: val ? Number(val) : undefined })} options={wardOptions} className="w-full h-[42px]" />
                </div>
            </div>
        );
    }

    // const renderPriceView = () => {
    //     const priceOptions = [
    //         { label: 'Tất cả khoảng giá', min: undefined, max: undefined },
    //         { label: 'Dưới 500 triệu', min: 0, max: 500 },
    //         { label: '500 - 800 triệu', min: 500, max: 800 },
    //         { label: '800 triệu - 1 tỷ', min: 800, max: 1000 },
    //         { label: '1 - 2 tỷ', min: 1000, max: 2000 },
    //         { label: '2 - 3 tỷ', min: 2000, max: 3000 },
    //         { label: 'Trên 3 tỷ', min: 3000, max: undefined }
    //     ];
    //     const minP = tempFilters.minPrice ?? 0;
    //     const maxP = tempFilters.maxPrice ?? 5000;

    //     return (
    //         <div className="flex flex-col gap-5 p-1 mt-2">
    //             <div className="flex items-center gap-3">
    //                 <div className="flex-1 border border-gray-300 rounded-lg p-2 text-center text-[0.85rem]"><span className="text-gray-400 text-xs block mb-0.5">Giá thấp nhất</span>{tempFilters.minPrice ? `${tempFilters.minPrice} triệu` : 'Từ'}</div>
    //                 <span className="text-gray-400">→</span>
    //                 <div className="flex-1 border border-gray-300 rounded-lg p-2 text-center text-[0.85rem]"><span className="text-gray-400 text-xs block mb-0.5">Giá cao nhất</span>{tempFilters.maxPrice ? `${tempFilters.maxPrice} triệu` : 'Đến'}</div>
    //             </div>
    //             <div className="px-2 mt-2">
    //                 <Slider range min={0} max={5000} step={100} value={[minP, maxP]} onChange={([min, max]) => setTempFilters({ ...tempFilters, minPrice: min === 0 ? undefined : min, maxPrice: max === 5000 ? undefined : max })} tooltip={{ formatter: (val) => `${val} triệu` }} />
    //             </div>
    //             <div className="flex flex-col gap-1">
    //                 {priceOptions.map((opt, i) => {
    //                     const isActive = tempFilters.minPrice === opt.min && tempFilters.maxPrice === opt.max;
    //                     return (
    //                         <label key={i} className="flex items-center justify-between py-2.5 cursor-pointer hover:bg-gray-50 px-2 rounded-lg" onClick={() => setTempFilters({ ...tempFilters, minPrice: opt.min, maxPrice: opt.max })}>
    //                             <span className={`text-[0.85rem] ${isActive ? 'text-[#1677ff] font-medium' : 'text-gray-700'}`}>{opt.label}</span>
    //                             <input type="radio" checked={isActive} readOnly className="w-4 h-4 accent-[#1677ff]" />
    //                         </label>
    //                     );
    //                 })}
    //             </div>
    //         </div>
    //     );
    // };

    // --- File: filter-modal.tsx ---

    const renderPriceView = () => {
        const isRent = draftFilters.type === 'RENT';

        // 1. Định nghĩa options phù hợp cho từng loại hình
        const priceOptions = isRent ? [
            { label: 'Tất cả khoảng giá', min: undefined, max: undefined },
            { label: 'Dưới 5 triệu', min: 0, max: 3000000 },
            { label: '3 - 10 triệu', min: 3000000, max: 10000000 },
            { label: '10 - 20 triệu', min: 10000000, max: 20000000 },
            { label: '20 - 50 triệu', min: 20000000, max: 50000000 },
            { label: 'Trên 50 triệu', min: 50000000, max: undefined }
        ] : [
            { label: 'Tất cả khoảng giá', min: undefined, max: undefined },
            { label: 'Dưới 500 triệu', min: 0, max: 500000000 },
            { label: '500 - 800 triệu', min: 500000000, max: 800000000 },
            { label: '800 triệu - 1 tỷ', min: 800000000, max: 1000000000 },
            { label: '1 - 2 tỷ', min: 1000000000, max: 2000000000 },
            { label: '2 - 3 tỷ', min: 2000000000, max: 3000000000 },
            { label: 'Trên 3 tỷ', min: 3000000000, max: undefined }
        ];



        // 3. Cấu hình cho Slider (Đơn vị nội bộ tính bằng triệu cho mượt)
        // Thuê: max 100tr, Bước nhảy 1tr. Bán: max 10 tỷ, Bước nhảy 100tr.
        const sliderConfig = isRent
            ? { min: 0, max: 100, step: 1, multiplier: 1000000, unit: 'tr' }
            : { min: 0, max: 10000, step: 100, multiplier: 1000000, unit: 'tr' };

        const minS = (tempFilters.minPrice || 0) / sliderConfig.multiplier;
        const maxS = (tempFilters.maxPrice || (sliderConfig.max * sliderConfig.multiplier)) / sliderConfig.multiplier;

        return (
            <div className="flex flex-col gap-5 p-1 mt-2">
                {/* Hiển thị giá đang chọn */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 border border-gray-300 rounded-lg p-2 text-center text-[0.85rem]">
                        <span className="text-gray-400 text-xs block mb-0.5">Giá thấp nhất</span>
                        {tempFilters.minPrice ? formatCompactMoney(tempFilters.minPrice) : 'Không giới hạn'}
                    </div>
                    <span className="text-gray-400">→</span>
                    <div className="flex-1 border border-gray-300 rounded-lg p-2 text-center text-[0.85rem]">
                        <span className="text-gray-400 text-xs block mb-0.5">Giá cao nhất</span>
                        {tempFilters.maxPrice ? formatCompactMoney(tempFilters.maxPrice) : 'không giới hạn'}
                    </div>
                </div>

                {/* Slider */}
                <div className="px-2 mt-2">
                    <Slider
                        range
                        min={sliderConfig.min}
                        max={sliderConfig.max}
                        step={sliderConfig.step}
                        value={[minS, maxS]}
                        onChange={([min, max]) => setTempFilters({
                            ...tempFilters,
                            minPrice: min === 0 ? undefined : min * sliderConfig.multiplier,
                            maxPrice: max === sliderConfig.max ? undefined : max * sliderConfig.multiplier
                        })}
                        tooltip={{ formatter: (val) => `${val} ${sliderConfig.unit}` }}
                    />
                </div>

                {/* Danh sách Radio options */}
                <div className="flex flex-col gap-1">
                    {priceOptions.map((opt, i) => {
                        const isActive = tempFilters.minPrice === opt.min && tempFilters.maxPrice === opt.max;
                        return (
                            <label key={i} className="flex items-center justify-between py-2.5 cursor-pointer hover:bg-gray-50 px-2 rounded-lg"
                                onClick={() => setTempFilters({ ...tempFilters, minPrice: opt.min, maxPrice: opt.max })}>
                                <span className={`text-[0.85rem] ${isActive ? 'text-[#1677ff] font-medium' : 'text-gray-700'}`}>{opt.label}</span>
                                <input type="radio" checked={isActive} readOnly className="w-4 h-4 accent-[#1677ff]" />
                            </label>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderAreaView = () => {
        const areaOptions = [
            { label: 'Tất cả diện tích', min: undefined, max: undefined },
            { label: 'Dưới 30 m²', min: 0, max: 30 },
            { label: '30 - 50 m²', min: 30, max: 50 },
            { label: '50 - 80 m²', min: 50, max: 80 },
            { label: '80 - 100 m²', min: 80, max: 100 },
            { label: 'Trên 100 m²', min: 100, max: undefined }
        ];
        const minA = tempFilters.minArea ?? 0;
        const maxA = tempFilters.maxArea ?? 500;

        return (
            <div className="flex flex-col gap-5 p-1 mt-2">
                <div className="flex items-center gap-3">
                    <div className="flex-1 border border-gray-300 rounded-lg p-2 text-center text-[0.85rem]"><span className="text-gray-400 text-xs block mb-0.5">Diện tích nhỏ nhất</span>{tempFilters.minArea ? `${tempFilters.minArea} m²` : 'Từ'}</div>
                    <span className="text-gray-400">→</span>
                    <div className="flex-1 border border-gray-300 rounded-lg p-2 text-center text-[0.85rem]"><span className="text-gray-400 text-xs block mb-0.5">Diện tích lớn nhất</span>{tempFilters.maxArea ? `${tempFilters.maxArea} m²` : 'Đến'}</div>
                </div>
                <div className="px-2 mt-2">
                    <Slider range min={0} max={500} step={10} value={[minA, maxA]} onChange={([min, max]) => setTempFilters({ ...tempFilters, minArea: min === 0 ? undefined : min, maxArea: max === 500 ? undefined : max })} tooltip={{ formatter: (val) => `${val} m²` }} />
                </div>
                <div className="flex flex-col gap-1">
                    {areaOptions.map((opt, i) => {
                        const isActive = tempFilters.minArea === opt.min && tempFilters.maxArea === opt.max;
                        return (
                            <label key={i} className="flex items-center justify-between py-2.5 cursor-pointer hover:bg-gray-50 px-2 rounded-lg" onClick={() => setTempFilters({ ...tempFilters, minArea: opt.min, maxArea: opt.max })}>
                                <span className={`text-[0.85rem] ${isActive ? 'text-[#1677ff] font-medium' : 'text-gray-700'}`}>{opt.label}</span>
                                <input type="radio" checked={isActive} readOnly className="w-4 h-4 accent-[#1677ff]" />
                            </label>
                        );
                    })}
                </div>
            </div>
        );
    };

    const ModalTitle = () => {
        if (activeView === 'MAIN') return <span>Bộ lọc</span>;
        const titles = { LOCATION: 'Khu vực, dự án', PRICE: 'Khoảng giá', AREA: 'Diện tích' };

        return (
            <div className="flex items-center gap-3 -ml-2 cursor-pointer hover:text-[#1677ff] transition-colors" onClick={cancelNestedView}>
                <ArrowLeftIcon /><span>{titles[activeView]}</span>
            </div>
        );
    };

    return (
        <AppModal isOpen={isOpen} onClose={() => { setActiveView('MAIN'); onClose(); }} title={<ModalTitle />} width={600}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .no-arrow-scroll::-webkit-scrollbar { width: 6px !important; }
                .no-arrow-scroll::-webkit-scrollbar-track { background: transparent !important; }
                .no-arrow-scroll::-webkit-scrollbar-thumb { background: #d1d5db !important; border-radius: 99px !important; }
                .no-arrow-scroll::-webkit-scrollbar-button { display: none !important; width: 0 !important; height: 0 !important; }
            `}} />

            <div className="max-h-[65vh] overflow-y-auto overflow-x-hidden -mx-4 px-4 pb-2 no-arrow-scroll">
                {activeView === 'MAIN' && renderMainView()}
                {activeView === 'LOCATION' && renderLocationView()}
                {activeView === 'PRICE' && renderPriceView()}
                {activeView === 'AREA' && renderAreaView()}
            </div>

            <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 gap-3">
                {activeView === 'MAIN' ? (
                    <>
                        <button onClick={() => setDraftFilters({ type: draftFilters.type || 'RENT', searchBy: ['title', 'description'] })} className="px-6 py-2.5 border border-gray-300 text-gray-700 text-[0.85rem] font-medium rounded-lg hover:bg-gray-50 transition-colors">Đặt lại</button>
                        <button onClick={() => { setActiveView('MAIN'); onApply(); }} className="flex-1 bg-[#1677ff] hover:bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-[0.95rem] shadow-sm transition-colors">Xem kết quả</button>
                    </>
                ) : (
                    <>
                        <button onClick={resetNestedView} className="px-6 py-2.5 border border-gray-300 text-gray-700 text-[0.85rem] font-medium rounded-lg hover:bg-gray-50 transition-colors">Đặt lại</button>
                        <button onClick={applyNestedView} className="flex-1 bg-[#1677ff] hover:bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-[0.95rem] shadow-sm transition-colors">Áp dụng</button>
                    </>
                )}
            </div>
        </AppModal>
    );
}