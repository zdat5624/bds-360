// @/features/posts/posts.constant.ts

// ==========================================
// 1. COMPASS DIRECTION (Hướng nhà/ban công)
// ==========================================
export const COMPASS_DIRECTION_VALUES = [
    'NORTH', 'NORTHEAST', 'EAST', 'SOUTHEAST',
    'SOUTH', 'SOUTHWEST', 'WEST', 'NORTHWEST',
] as const;

export type CompassDirection = (typeof COMPASS_DIRECTION_VALUES)[number];

export const COMPASS_DIRECTION_LABEL: Record<CompassDirection, string> = {
    NORTH: 'Bắc',
    NORTHEAST: 'Đông Bắc',
    EAST: 'Đông',
    SOUTHEAST: 'Đông Nam',
    SOUTH: 'Nam',
    SOUTHWEST: 'Tây Nam',
    WEST: 'Tây',
    NORTHWEST: 'Tây Bắc',
};

export const COMPASS_DIRECTION_OPTIONS = COMPASS_DIRECTION_VALUES.map(val => ({
    label: COMPASS_DIRECTION_LABEL[val],
    value: val
}));

// ==========================================
// 2. FURNISHING (Tình trạng nội thất)
// ==========================================
export const FURNISHING_VALUES = ['FULLY_FURNISHED', 'BASIC', 'UNFURNISHED', 'OTHER'] as const;

export type Furnishing = (typeof FURNISHING_VALUES)[number];

export const FURNISHING_LABEL: Record<Furnishing, string> = {
    FULLY_FURNISHED: 'Đầy đủ',
    BASIC: 'Cơ bản',
    UNFURNISHED: 'Không nội thất',
    OTHER: 'Khác',
};

export const FURNISHING_OPTIONS = FURNISHING_VALUES.map(val => ({
    label: FURNISHING_LABEL[val],
    value: val
}));

// ==========================================
// 3. LEGAL STATUS (Tình trạng pháp lý)
// ==========================================
export const LEGAL_STATUS_VALUES = ['PINK_BOOK', 'SALE_CONTRACT', 'WAITING', 'OTHER'] as const;

export type LegalStatus = (typeof LEGAL_STATUS_VALUES)[number];

export const LEGAL_STATUS_LABEL: Record<LegalStatus, string> = {
    PINK_BOOK: 'Sổ đỏ/Sổ hồng',
    SALE_CONTRACT: 'Hợp đồng mua bán',
    WAITING: 'Đang chờ sổ',
    OTHER: 'Khác',
};

export const LEGAL_STATUS_OPTIONS = LEGAL_STATUS_VALUES.map(val => ({
    label: LEGAL_STATUS_LABEL[val],
    value: val
}));

// ==========================================
// 4. ROOM OPTIONS (Phòng ngủ/Phòng tắm)
// ==========================================
export const ROOM_OPTIONS = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5+', value: 5 }, // Backend handle: >= 5
];
// ==========================================
// 5. POST STATUS (Source of Truth)
// ==========================================
export const POST_STATUS_VALUES = [
    'PENDING',
    'REVIEW_LATER',
    'APPROVED',
    'REJECTED',
    'EXPIRED',
    'BLOCKED'
] as const;

export type PostStatus = (typeof POST_STATUS_VALUES)[number];

export const POST_STATUS_LABEL: Record<PostStatus, string> = {
    PENDING: 'Chờ duyệt',
    REVIEW_LATER: 'Xem xét sau',
    APPROVED: 'Đang hoạt động',
    REJECTED: 'Bị từ chối',
    EXPIRED: 'Hết hạn',
    BLOCKED: 'Bị khóa/Vi phạm',
};

export const POST_STATUS_COLOR: Record<PostStatus, string> = {
    APPROVED: 'success',
    PENDING: 'warning',
    REVIEW_LATER: 'processing',
    REJECTED: 'error',
    BLOCKED: 'error',
    EXPIRED: 'default',
};

// ==========================================
// 6. UI MAPPING & OPTIONS
// ==========================================

/**
 * Dành cho User (My Posts) - Chuyển đổi trạng thái kỹ thuật sang trạng thái hiển thị
 * Quy tắc: REVIEW_LATER (tin VIP đang đợi duyệt lại) được coi là APPROVED (Đang hoạt động)
 */
export const USER_POST_STATUS_DISPLAY: Record<PostStatus, PostStatus> = {
    PENDING: 'PENDING',
    REVIEW_LATER: 'APPROVED',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    EXPIRED: 'EXPIRED',
    BLOCKED: 'BLOCKED',
};

/**
 * Danh sách Tab hiển thị cho User (Đã gộp)
 */
export const USER_POST_STATUS_OPTIONS = [
    { value: 'PENDING', label: POST_STATUS_LABEL.PENDING },
    { value: 'APPROVED', label: POST_STATUS_LABEL.APPROVED }, // "Đang hoạt động"
    { value: 'REJECTED', label: POST_STATUS_LABEL.REJECTED },
    { value: 'EXPIRED', label: POST_STATUS_LABEL.EXPIRED },
    { value: 'BLOCKED', label: POST_STATUS_LABEL.BLOCKED },
];

/**
 * Dành cho Admin/Manage - Hiển thị đầy đủ
 */
export const MANAGE_POST_STATUS_OPTIONS = POST_STATUS_VALUES.map((status) => ({
    value: status,
    label: POST_STATUS_LABEL[status],
}));