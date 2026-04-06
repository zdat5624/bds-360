// @/features/addresses/api/addresses.queries.ts

import customFetch from '@/lib/custom-fetch';
import { useQuery } from '@tanstack/react-query';
import { Coordinate, District, Province, Ward } from './types';

export const ADDRESSES_QUERY_KEYS = {
    all: ['addresses'] as const,
    provinces: () => [...ADDRESSES_QUERY_KEYS.all, 'provinces'] as const,
    districts: (provinceCode: number) => [...ADDRESSES_QUERY_KEYS.all, 'districts', provinceCode] as const,
    wards: (districtCode: number) => [...ADDRESSES_QUERY_KEYS.all, 'wards', districtCode] as const,
    geocode: (address: string) => [...ADDRESSES_QUERY_KEYS.all, 'geocode', address] as const,
};

// --- FETCHERS ---
const getProvinces = async (): Promise<Province[]> => {
    return customFetch.get('/provinces');
};

const getDistricts = async (provinceCode: number): Promise<District[]> => {
    return customFetch.get(`/provinces/${provinceCode}/districts`);
};

const getWards = async (districtCode: number): Promise<Ward[]> => {
    return customFetch.get(`/districts/${districtCode}/wards`);
};

const getCoordinates = async (address: string): Promise<Coordinate> => {
    return customFetch.get('/addresses/geocode', { params: { address } });
};

// --- HOOKS ---

export const useGetProvinces = () => {
    return useQuery({
        queryKey: ADDRESSES_QUERY_KEYS.provinces(),
        queryFn: getProvinces,
        // Thủ thuật: Địa giới hành chính rất ít thay đổi.
        // Set staleTime thành Infinity (hoặc 24h) để React Query không bao giờ tự động gọi lại API này
        // trong suốt phiên làm việc của user, giúp tiết kiệm băng thông tuyệt đối.
        staleTime: Infinity,
    });
};

export const useGetDistricts = (provinceCode?: number) => {
    return useQuery({
        // Nếu chưa chọn Tỉnh (undefined), nhét tạm số 0 vào key để không bị lỗi type
        queryKey: ADDRESSES_QUERY_KEYS.districts(provinceCode ?? 0),
        queryFn: () => getDistricts(provinceCode!),
        // Cờ enabled: Chỉ gọi API khi đã có provinceCode hợp lệ
        enabled: !!provinceCode,
        staleTime: Infinity,
    });
};

export const useGetWards = (districtCode?: number) => {
    return useQuery({
        queryKey: ADDRESSES_QUERY_KEYS.wards(districtCode ?? 0),
        queryFn: () => getWards(districtCode!),
        enabled: !!districtCode,
        staleTime: Infinity,
    });
};

export const useGetCoordinates = (address: string, enabled: boolean = false) => {
    return useQuery({
        queryKey: ADDRESSES_QUERY_KEYS.geocode(address),
        queryFn: () => getCoordinates(address),
        // Tính năng tìm bản đồ thường do user bấm nút "Tìm kiếm" kích hoạt, nên enabled mặc định là false
        enabled,
        // Tọa độ của một địa chỉ cố định sẽ không đổi, có thể cache lâu
        staleTime: Infinity,
    });
};