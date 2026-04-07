// @/constants/gender.constant.ts

export const GENDER_VALUES = ['FEMALE', 'MALE', 'OTHER'] as const;

export type Gender = (typeof GENDER_VALUES)[number];

// 1. Dùng để map text hiển thị (Ví dụ: render "Nữ" ra màn hình thay vì "FEMALE")
// Việc dùng Record<Gender, string> giúp TypeScript báo lỗi ngay nếu bạn thêm Value mới mà quên thêm Label
export const GENDER_LABEL: Record<Gender, string> = {
    FEMALE: 'Nữ',
    MALE: 'Nam',
    OTHER: 'Khác',
};

// 2. Dùng làm data cho các component như <Select>, <Radio.Group>
export const GENDER_OPTIONS = GENDER_VALUES.map((value) => ({
    value,
    label: GENDER_LABEL[value], // Tự động lấy tiếng Việt tương ứng
}));