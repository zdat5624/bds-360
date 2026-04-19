// @/features/users/users.constant.ts

// @/features/users/users.constant.ts

export const VERIFICATION_STATUS_VALUES = ['PENDING', 'APPROVED', 'REJECTED'] as const;

export type VerificationStatus = (typeof VERIFICATION_STATUS_VALUES)[number];

export const VERIFICATION_STATUS_LABEL: Record<VerificationStatus, string> = {
    PENDING: 'Đang chờ duyệt',
    APPROVED: 'Đã phê duyệt',
    REJECTED: 'Bị từ chối',
};

// Dùng cho dropdown filter
export const VERIFICATION_STATUS_OPTIONS = VERIFICATION_STATUS_VALUES.map((value) => ({
    value,
    label: VERIFICATION_STATUS_LABEL[value],
}));