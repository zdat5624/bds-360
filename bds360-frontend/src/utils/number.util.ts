// @/utils/number.util.ts
/**
 * 1. Format tiền Việt Nam Đồng (VND)
 * @example formatCurrency(15000000) => "15.000.000 ₫"
 */
export const formatCurrency = (amount?: number | null): string => {
    if (amount === undefined || amount === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

/**
 * 2. Format số rút gọn chung
 * @example formatCompactMoney(1500000000) => "1,5 Tỷ"
 * @example formatCompactMoney(800000000) => "800 Triệu"
 */
export const formatCompactMoney = (amount?: number | null): string => {
    // 1. Nếu không có giá trị (undefined hoặc null), trả về chuỗi rỗng
    if (amount === undefined || amount === null) return '';

    // 2. Nếu bằng đúng số 0
    if (amount === 0) return '0 ₫';

    // 3. Đơn vị Tỷ (từ 1.000.000.000 trở lên)
    if (amount >= 1_000_000_000) {
        return `${(amount / 1_000_000_000).toLocaleString('vi-VN')} Tỷ`;
    }

    // 4. Đơn vị Triệu (từ 1.000.000 trở lên)
    if (amount >= 1_000_000) {
        return `${(amount / 1_000_000).toLocaleString('vi-VN')} Triệu`;
    }

    // 5. Đơn vị Nghìn (từ 1.000 trở lên) - MỚI THÊM
    if (amount >= 1_000) {
        return `${(amount / 1_000).toLocaleString('vi-VN')} Nghìn`;
    }

    // 6. Các trường hợp nhỏ hơn 1.000 (ví dụ: 500 đồng)
    return formatCurrency(amount);
};

/**
 * 3. Format con số thông thường có dấu chấm phân cách
 * @example formatNumber(10000.5) => "10.000,5"
 */
export const formatNumber = (num?: number | null): string => {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('vi-VN').format(num);
};

