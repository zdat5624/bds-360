// @/utils/date.util.ts
import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // Import ngôn ngữ tiếng Việt
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime'; // Plugin tính thời gian tương đối

// Kích hoạt các plugin cần thiết
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.locale('vi'); // Set ngôn ngữ mặc định là tiếng Việt

// Định nghĩa các Format chuẩn của hệ thống để dùng chung
export const DATE_FORMAT = {
    DEFAULT: 'DD/MM/YYYY',
    FULL_TIME: 'HH:mm - DD/MM/YYYY',
    API_FORMAT: 'YYYY-MM-DD', // Chuẩn ISO thường dùng gửi lên Backend
};

/**
 * 1. Format ngày tháng hiển thị ra UI
 * @example formatDate('2024-03-15') => '15/03/2024'
 */
export const formatDate = (
    date?: string | Date | number | null,
    format = DATE_FORMAT.DEFAULT
): string => {
    if (!date) return '--'; // Hoặc trả về chuỗi rỗng tùy dự án
    const parsedDate = dayjs(date);
    return parsedDate.isValid() ? parsedDate.format(format) : '--';
};

/**
 * 2. Format ngày giờ hiển thị ra UI
 * @example formatDateTime('2024-03-15T14:30:00') => '14:30 - 15/03/2024'
 */
export const formatDateTime = (
    date?: string | Date | number | null
): string => {
    return formatDate(date, DATE_FORMAT.FULL_TIME);
};

/**
 * 3.1 Tính thời gian tương đối (Cách đây bao lâu)
 * @example getRelativeTime('2024-03-14') => '1 ngày trước'
 */
export const getRelativeTime = (
    date?: string | Date | number | null
): string => {
    if (!date) return '';
    const parsedDate = dayjs(date);
    return parsedDate.isValid() ? parsedDate.fromNow() : '';
};

/**
 * 3.2 Tính thời gian tương đối thông minh (Smart Relative Time)
 * Dưới 60s: Vừa xong (hoặc x giây trước)
 * Dưới 60p: x phút trước
 * Dưới 24h: x giờ trước
 * Qua 24h: Hiển thị ngày tháng chuẩn (VD: 15/03/2024)
 */
export const getSmartRelativeTime = (
    date?: string | Date | number | null
): string => {
    if (!date) return '--';

    const parsedDate = dayjs(date);
    if (!parsedDate.isValid()) return '--';

    const now = dayjs();

    // Tính toán khoảng cách thời gian
    const diffInSeconds = now.diff(parsedDate, 'second');
    const diffInMinutes = now.diff(parsedDate, 'minute');
    const diffInHours = now.diff(parsedDate, 'hour');

    // Tùy chỉnh text hiển thị theo ý muốn
    if (diffInSeconds < 60) {
        return `${diffInSeconds} giây trước`; // Hoặc bạn có thể dùng: return `${diffInSeconds} giây trước`;
    }

    if (diffInMinutes < 60) {
        return `${diffInMinutes} phút trước`;
    }

    if (diffInHours < 24) {
        return `${diffInHours} giờ trước`;
    }

    // Nếu đã qua 24h, trả về ngày tháng chuẩn (Ví dụ: 15/03/2024)
    return parsedDate.format(DATE_FORMAT.DEFAULT);
};

/**
 * 4. Chuyển Date sang String để gửi lên API
 * @example toApiDate(new Date()) => '2024-03-15'
 */
export const toApiDate = (
    date?: string | Date | number | null
): string | undefined => {
    if (!date) return undefined;
    const parsedDate = dayjs(date);
    return parsedDate.isValid() ? parsedDate.format(DATE_FORMAT.API_FORMAT) : undefined;
};

/**
 * 5. Check xem một ngày có phải là hôm nay không
 */
export const isToday = (date: string | Date | number): boolean => {
    return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * Xuất luôn object dayjs để những chỗ nào cần xử lý phức tạp có thể dùng trực tiếp
 */
export { dayjs };
