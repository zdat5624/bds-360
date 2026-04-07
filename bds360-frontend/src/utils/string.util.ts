// @/utils/string.util.ts

/**
 * 1. Cắt chữ có dấu ba chấm ở cuối
 * @example truncate('Một đoạn văn rất là dài', 10) => 'Một đoạn v...'
 */
export const truncate = (str: string, maxLength: number): string => {
    if (!str) return '';
    return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
};

/**
 * 2. Chuyển đổi tên thành URL (Slug) cho SEO
 * @example toSlug('Nhà phố siêu đẹp 2024!') => 'nha-pho-sieu-dep-2024'
 */
// export const toSlug = (str: string): string => {
//     if (!str) return '';
//     return str
//         .toLowerCase()
//         .normalize('NFD') // Tách dấu ra khỏi chữ
//         .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
//         .replace(/[đĐ]/g, 'd') // Thay chữ đ
//         .replace(/([^0-9a-z-\s])/g, '') // Xóa ký tự đặc biệt
//         .replace(/(\s+)/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
//         .replace(/-+/g, '-') // Xóa các dấu gạch ngang liên tiếp
//         .replace(/^-+|-+$/g, ''); // Xóa gạch ngang ở 2 đầu
// };