// @/constants/listing.constant.ts

export const LISTING_TYPE_VALUES = ['SALE', 'RENT'] as const;

export type ListingType = (typeof LISTING_TYPE_VALUES)[number];

export const LISTING_TYPE_LABEL: Record<ListingType, string> = {
    SALE: 'Mua bán',
    RENT: 'Cho thuê',
};

/**
 * Sử dụng mã màu Hex chuẩn Ant Design v5
 * SALE: Blue 6
 * RENT: Cyan 6
 */
export const LISTING_TYPE_COLOR: Record<ListingType, string> = {
    SALE: '#1677ff',
    RENT: '#13c2c2',
};

export const LISTING_TYPE_OPTIONS = LISTING_TYPE_VALUES.map((value) => ({
    value,
    label: LISTING_TYPE_LABEL[value],
}));