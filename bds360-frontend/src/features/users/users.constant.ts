// @/features/users/users.constant.ts

export const GENDER_OPTIONS = {
    FEMALE: 'FEMALE',
    MALE: 'MALE',
    OTHER: 'OTHER',
} as const;

export const ROLE_OPTIONS = {
    ADMIN: 'ADMIN',
    USER: 'USER',
} as const;


export type Gender = keyof typeof GENDER_OPTIONS;
export type Role = keyof typeof ROLE_OPTIONS;