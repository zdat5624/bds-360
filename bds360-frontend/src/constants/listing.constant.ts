// @/constants/listing.constant.ts

export const LISTING_TYPE_VALUES = ['SALE', 'RENT'] as const;

export type ListingType = (typeof LISTING_TYPE_VALUES)[number];

// Map hiển thị tiếng Việt
export const LISTING_TYPE_LABEL: Record<ListingType, string> = {
    SALE: 'Bán',
    RENT: 'Cho thuê',
};

// Options cho Form Select
export const LISTING_TYPE_OPTIONS = LISTING_TYPE_VALUES.map((value) => ({
    value,
    label: LISTING_TYPE_LABEL[value],
}));