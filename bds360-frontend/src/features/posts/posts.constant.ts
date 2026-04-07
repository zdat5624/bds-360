// @/features/posts/posts.constant.ts

// ==========================================
// 1. COMPASS DIRECTION (Hướng nhà/ban công)
// ==========================================
export const COMPASS_DIRECTION_VALUES = [
    'NORTH',
    'NORTHEAST',
    'EAST',
    'SOUTHEAST',
    'SOUTH',
    'SOUTHWEST',
    'WEST',
    'NORTHWEST',
] as const;

export type CompassDirection = (typeof COMPASS_DIRECTION_VALUES)[number];

export const COMPASS_DIRECTION_OPTIONS = Object.fromEntries(
    COMPASS_DIRECTION_VALUES.map((item) => [item, item])
) as Record<CompassDirection, CompassDirection>;


// ==========================================
// 2. FURNISHING (Tình trạng nội thất)
// ==========================================
export const FURNISHING_VALUES = [
    'FULLY_FURNISHED',
    'BASIC',
    'UNFURNISHED',
    'OTHER'
] as const;

export type Furnishing = (typeof FURNISHING_VALUES)[number];

export const FURNISHING_OPTIONS = Object.fromEntries(
    FURNISHING_VALUES.map((item) => [item, item])
) as Record<Furnishing, Furnishing>;


// ==========================================
// 3. LEGAL STATUS (Tình trạng pháp lý)
// ==========================================
export const LEGAL_STATUS_VALUES = [
    'PINK_BOOK',
    'SALE_CONTRACT',
    'WAITING',
    'OTHER'
] as const;

export type LegalStatus = (typeof LEGAL_STATUS_VALUES)[number];

export const LEGAL_STATUS_OPTIONS = Object.fromEntries(
    LEGAL_STATUS_VALUES.map((item) => [item, item])
) as Record<LegalStatus, LegalStatus>;


// ==========================================
// 4. POST STATUS (Trạng thái bài đăng)
// ==========================================
export const POST_STATUS_VALUES = [
    'PENDING',
    'REVIEW_LATER',
    'APPROVED',
    'REJECTED',
    'EXPIRED',
] as const;

export type PostStatus = (typeof POST_STATUS_VALUES)[number];

export const POST_STATUS_OPTIONS = Object.fromEntries(
    POST_STATUS_VALUES.map((item) => [item, item])
) as Record<PostStatus, PostStatus>;