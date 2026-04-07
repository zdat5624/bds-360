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
 * 2. Format số rút gọn cho Bất động sản (Rất hay dùng)
 * @example formatCompactMoney(1500000000) => "1,5 Tỷ"
 * @example formatCompactMoney(800000000) => "800 Triệu"
 */
export const formatCompactMoney = (amount?: number | null): string => {
    if (!amount) return '0 ₫';
    if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toLocaleString('vi-VN')} Tỷ`;
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toLocaleString('vi-VN')} Triệu`;
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