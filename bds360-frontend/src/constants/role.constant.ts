// @/constants/role.constant.ts

export const USER_ROLE_VALUES = ['ADMIN', 'USER'] as const;

export type Role = (typeof USER_ROLE_VALUES)[number];

// Map hiển thị tiếng Việt
export const USER_ROLE_LABEL: Record<Role, string> = {
    ADMIN: 'Quản trị viên',
    USER: 'Người dùng',
};

// Options cho Form Select
export const USER_ROLE_OPTIONS = USER_ROLE_VALUES.map((value) => ({
    value,
    label: USER_ROLE_LABEL[value],
}));