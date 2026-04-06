// @/constants/listing.constant.ts

export const LISTING_TYPE_OPTIONS = {
    SALE: 'SALE',
    RENT: 'RENT',
} as const;

export type ListingType = keyof typeof LISTING_TYPE_OPTIONS;