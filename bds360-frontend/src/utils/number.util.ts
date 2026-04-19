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

/**
 * 4. 🌟 Format giá ĐẶC THÙ CHO TIN ĐĂNG BĐS (Dựa trên logic dự án cũ)
 * - Giá = 0: "Thỏa thuận"
 * - Giá >= 1 Tỷ: "1,5 tỷ" (tối đa 2 chữ số thập phân)
 * - Giá < 50 Triệu: "4,5 triệu" (tối đa 1 chữ số thập phân - dành cho tin Thuê)
 * - Giá từ 50 Triệu -> 999 Triệu: "800 triệu" (làm tròn nguyên - dành cho tin Bán)
 */
export const formatPostPrice = (price?: number | null): string => {
    if (price === undefined || price === null) return 'Đang cập nhật';
    if (price === 0) return 'Thỏa thuận';

    const priceInMillions = price / 1_000_000;

    if (priceInMillions >= 1000) {
        // >= 1 tỷ (Ví dụ: 1.250.000.000 -> 1,25 tỷ)
        const priceInBillions = priceInMillions / 1000;
        return `${priceInBillions.toLocaleString('vi-VN', { maximumFractionDigits: 2 })} tỷ`;

    } else if (priceInMillions < 50) {
        // < 50 triệu (Ví dụ: 4.500.000 -> 4,5 triệu)
        return `${priceInMillions.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} triệu`;

    } else {
        // Từ 50 triệu đến dưới 1 tỷ (Ví dụ: 850.000.000 -> 850 triệu)
        return `${priceInMillions.toLocaleString('vi-VN', { maximumFractionDigits: 0 })} triệu`;
    }
};