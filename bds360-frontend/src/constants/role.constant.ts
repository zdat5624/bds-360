// @/constants/role.constant.ts

// Thêm MODERATOR vào mảng giá trị
export const USER_ROLE_VALUES = ['ADMIN', 'MODERATOR', 'USER'] as const;

export type Role = (typeof USER_ROLE_VALUES)[number];

// Map hiển thị tiếng Việt
export const USER_ROLE_LABEL: Record<Role, string> = {
    ADMIN: 'Quản trị viên',
    MODERATOR: 'Kiểm duyệt viên',
    USER: 'Người dùng',
};

// Options cho Form Select
export const USER_ROLE_OPTIONS = USER_ROLE_VALUES.map((value) => ({
    value,
    label: USER_ROLE_LABEL[value],
}));