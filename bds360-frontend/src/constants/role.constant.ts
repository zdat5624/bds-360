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

export const USER_ROLE_OPTIONS_NO_ADMIN = USER_ROLE_VALUES
    .filter(role => role !== 'ADMIN')
    .map((value) => ({
        value,
        label: USER_ROLE_LABEL[value],
    }));

export const USER_ROLE_COLOR: Record<Role, string> = {
    ADMIN: '#f5222d',
    MODERATOR: '#722ed1',
    USER: '#1677ff',
};