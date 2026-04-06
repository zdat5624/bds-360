// @/features/vips/api/types.ts

export interface Vip {
    id: number;
    vipLevel: number;
    name: string;
    pricePerDay: number;
}

export interface UpdateVipPricePayload {
    id: number; // Được dùng để truyền vào Path Variable trên URL
    newPrice: number;
}