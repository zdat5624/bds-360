// @/constants/gender.constant.ts
export const GENDER_OPTIONS = {
    FEMALE: 'FEMALE',
    MALE: 'MALE',
    OTHER: 'OTHER',
} as const;

export type Gender = keyof typeof GENDER_OPTIONS;