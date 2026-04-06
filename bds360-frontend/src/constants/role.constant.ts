// @/constants/role.constant.ts

export const USER_ROLE_OPTIONS = {
    ADMIN: 'ADMIN',
    USER: 'USER',
} as const;

export type Role = keyof typeof USER_ROLE_OPTIONS;