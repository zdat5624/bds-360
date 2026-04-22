import { ListingType } from '@/constants'; // Import Enum hoặc Type của bạn
import { Post } from './api/types';

/**
 *  Format giá ĐẶC THÙ CHO TIN ĐĂNG BĐS
 * - Giá = 0: "Thỏa thuận"
 * - Giá >= 1 Tỷ: "1,5 tỷ" (tối đa 2 chữ số thập phân)
 * - Giá từ 50 Triệu -> 999 Triệu: "800 triệu" (làm tròn nguyên)
 * - Giá từ 1 Triệu -> < 50 Triệu: "4,5 triệu" (tối đa 2 chữ số thập phân)
 * - Giá < 1 Triệu: "500 nghìn" (làm tròn nguyên)
 */
export const formatPostPrice = (price?: number | null, type?: ListingType): string => {
    if (price === undefined || price === null) return 'Đang cập nhật';
    if (price === 0) return 'Thỏa thuận';

    const suffix = type === 'RENT' ? '/tháng' : '';
    let result = '';

    if (price >= 1_000_000_000) {
        // >= 1 tỷ (Ví dụ: 1.25 tỷ)
        const priceInBillions = price / 1_000_000_000;
        result = `${priceInBillions.toLocaleString('vi-VN', { maximumFractionDigits: 2 })} tỷ`;
    }
    else if (price >= 50_000_000) {
        // Từ 50 triệu đến < 1 tỷ (Ví dụ: 800 triệu)
        const priceInMillions = price / 1_000_000;
        result = `${priceInMillions.toLocaleString('vi-VN', { maximumFractionDigits: 0 })} triệu`;
    }
    else if (price >= 1_000_000) {
        // Từ 1 triệu đến < 50 triệu (Ví dụ: 4,5 triệu)
        const priceInMillions = price / 1_000_000;
        result = `${priceInMillions.toLocaleString('vi-VN', { maximumFractionDigits: 2 })} triệu`;
    }
    else {
        //  < 1 triệu (Ví dụ: 500 nghìn)
        const priceInThousands = price / 1_000;
        result = `${priceInThousands.toLocaleString('vi-VN', { maximumFractionDigits: 0 })} nghìn`;
    }

    return `${result}${suffix}`;
};

/**
 *  Nối các phần tử địa chỉ của một bài đăng thành chuỗi hoàn chỉnh
 * Tự động bỏ qua các trường bị trống.
 */
export const getFullAddress = (post?: Post | null): string => {
    if (!post) return 'Đang cập nhật';

    // Lọc bỏ các giá trị null/undefined/rỗng và nối lại bằng dấu phẩy
    return [
        post.streetAddress,
        post.wardName,
        post.districtName,
        post.provinceName
    ].filter(Boolean).join(', ');
};

/**
 * Lấy địa chỉ ngắn gọn (Chỉ gồm Quận/Huyện và Tỉnh/Thành phố)
 * Phù hợp hiển thị trên các thẻ (Card) có không gian hẹp.
 */
export const getShortAddress = (post?: Post | null): string => {
    if (!post) return 'Đang cập nhật';

    return [
        post.districtName,
        post.provinceName
    ].filter(Boolean).join(', ');
};