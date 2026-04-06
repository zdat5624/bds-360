// @/features/posts/posts.constant.ts

export const COMPASS_DIRECTION_OPTIONS = {
    NORTH: 'NORTH',
    NORTHEAST: 'NORTHEAST',
    EAST: 'EAST',
    SOUTHEAST: 'SOUTHEAST',
    SOUTH: 'SOUTH',
    SOUTHWEST: 'SOUTHWEST',
    WEST: 'WEST',
    NORTHWEST: 'NORTHWEST',
} as const;

export type CompassDirection = keyof typeof COMPASS_DIRECTION_OPTIONS;

export const FURNISHING_OPTIONS = {
    FULLY_FURNISHED: 'FULLY_FURNISHED',
    BASIC: 'BASIC',
    UNFURNISHED: 'UNFURNISHED',
    OTHER: 'OTHER',
} as const;

export type Furnishing = keyof typeof FURNISHING_OPTIONS;

export const LEGAL_STATUS_OPTIONS = {
    PINK_BOOK: 'PINK_BOOK',
    SALE_CONTRACT: 'SALE_CONTRACT',
    WAITING: 'WAITING',
    OTHER: 'OTHER',
} as const;

export type LegalStatus = keyof typeof LEGAL_STATUS_OPTIONS;

export const POST_STATUS_OPTIONS = {
    PENDING: 'PENDING',
    REVIEW_LATER: 'REVIEW_LATER',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    EXPIRED: 'EXPIRED',
} as const;

export type PostStatus = keyof typeof POST_STATUS_OPTIONS;