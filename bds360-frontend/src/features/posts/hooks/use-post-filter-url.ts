// File: @/features/posts/hooks/use-post-filter-url.ts
import { PostFilterParams } from '@/features/posts/api/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function usePostFilterUrl(defaultType: 'RENT' | 'SALE') {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // ==========================================
    // 1. ĐỌC DỮ LIỆU TỪ URL (URL -> OBJECT)
    // ==========================================
    const filters = useMemo(() => {
        const params: Partial<PostFilterParams> = {};

        // Mặc định ép kiểu type theo trang (Trừ khi user cố tình gõ url khác)
        params.type = (searchParams.get('type') as 'RENT' | 'SALE') || defaultType;

        if (searchParams.has('search')) params.search = searchParams.get('search') as string;
        if (searchParams.has('searchBy')) params.searchBy = searchParams.getAll('searchBy'); // Dùng getAll vì nó là Mảng

        // Chuyển đổi các trường dạng Số (Number)
        ['minPrice', 'maxPrice', 'minArea', 'maxArea', 'bedrooms', 'bathrooms', 'provinceCode', 'districtCode', 'wardCode'].forEach(key => {
            if (searchParams.has(key)) {
                (params as any)[key] = Number(searchParams.get(key));
            }
        });

        // Chuyển đổi các trường dạng Chuỗi (String/Enum)
        ['houseDirection', 'balconyDirection', 'legalStatus', 'furnishing'].forEach(key => {
            if (searchParams.has(key)) {
                (params as any)[key] = searchParams.get(key);
            }
        });

        return params;
    }, [searchParams, defaultType]);

    // Trích xuất số trang (Mặc định là 1)
    const page = Number(searchParams.get('page')) || 1;

    // ==========================================
    // 2. GHI DỮ LIỆU LÊN URL (OBJECT -> URL)
    // ==========================================
    const updateUrl = (newFilters: Partial<PostFilterParams>, newPage: number = 1) => {
        const params = new URLSearchParams();

        // Nạp tất cả bộ lọc vào URL
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    value.forEach(v => params.append(key, String(v)));
                } else {
                    params.set(key, String(value));
                }
            }
        });

        // Luôn nạp tham số phân trang
        if (newPage > 1) {
            params.set('page', String(newPage));
        }

        // Logic điều hướng thông minh: Chuyển trang Sale/Rent nếu người dùng đổi Type ở thanh tìm kiếm
        if (newFilters.type === 'SALE' && pathname !== '/sale') {
            router.push(`/sale?${params.toString()}`);
        } else if (newFilters.type === 'RENT' && pathname !== '/rent') {
            router.push(`/rent?${params.toString()}`);
        } else {
            // Cùng trang thì chỉ đẩy tham số (Không load lại toàn bộ trang - scroll: false)
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }
    };

    return { filters, page, updateUrl };
}