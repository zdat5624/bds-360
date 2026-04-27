// File: @/features/posts/hooks/use-post-filter-url.ts
import { ListingType } from '@/constants';
import { PostFilterParams } from '@/features/posts/api/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function usePostFilterUrl(defaultType: ListingType) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // ==========================================
    // 1. ĐỌC DỮ LIỆU TỪ URL (URL -> OBJECT)
    // ==========================================
    const filters = useMemo(() => {
        const params: Partial<PostFilterParams> = {};

        // Giữ nguyên logic ép kiểu type hoặc dùng default
        params.type = (searchParams.get('type') as ListingType) || defaultType;

        if (searchParams.has('search')) params.search = searchParams.get('search')!;

        // Giữ nguyên logic getAll cho mảng searchBy
        if (searchParams.has('searchBy')) params.searchBy = searchParams.getAll('searchBy');

        // Logic cũ: Chuyển đổi các trường dạng Số
        const numberFields = [
            'minPrice', 'maxPrice', 'minArea', 'maxArea',
            'bedrooms', 'bathrooms', 'provinceCode', 'districtCode', 'wardCode',
            'categoryId', 'vipId' // Tôi bổ sung thêm 2 trường này vì có trong Type của bác
        ] as const;

        numberFields.forEach(key => {
            if (searchParams.has(key)) {
                // Fix lỗi any bằng cách ép kiểu keyof PostFilterParams
                (params[key as keyof PostFilterParams] as number) = Number(searchParams.get(key));
            }
        });

        // Logic cũ: Chuyển đổi các trường dạng Chuỗi (Enum)
        const stringFields = [
            'houseDirection', 'balconyDirection', 'legalStatus', 'furnishing'
        ] as const;

        stringFields.forEach(key => {
            if (searchParams.has(key)) {
                (params[key as keyof PostFilterParams] as string) = searchParams.get(key)!;
            }
        });

        return params;
    }, [searchParams, defaultType]);

    const page = Number(searchParams.get('page')) || 1;

    // ==========================================
    // 2. GHI DỮ LIỆU LÊN URL (OBJECT -> URL)
    // ==========================================
    const updateUrl = (newFilters: Partial<PostFilterParams>, newPage: number = 1) => {
        const params = new URLSearchParams();

        // Giữ nguyên logic duyệt Entries và xử lý Array.append / Single.set
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    value.forEach(v => params.append(key, String(v)));
                } else {
                    params.set(key, String(value));
                }
            }
        });

        if (newPage > 1) {
            params.set('page', String(newPage));
        }

        const queryString = params.toString();
        const url = queryString ? `?${queryString}` : '';

        // ĐỐI CHIẾU CHÍNH XÁC LOGIC ĐIỀU HƯỚNG CŨ CỦA BÁC:
        if (newFilters.type === 'SALE' && pathname !== '/sale') {
            router.push(`/sale${url}`);
        } else if (newFilters.type === 'RENT' && pathname !== '/rent') {
            router.push(`/rent${url}`);
        } else {
            // Cùng trang thì dùng shallow route (scroll: false)
            router.push(`${pathname}${url}`, { scroll: false });
        }
    };

    return { filters, page, updateUrl };
}