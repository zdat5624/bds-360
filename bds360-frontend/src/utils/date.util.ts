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
    FULL_TIME: 'HH:mm DD/MM/YYYY',
    SHORT_DATE: 'DD/MM',
    MONTH_YEAR: 'MM/YYYY',
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
    date?: string | Date | number | null,

): string => {
    return formatDate(date, DATE_FORMAT.FULL_TIME);
};



/**
 * 3. Tính thời gian tương đối thông minh (Smart Relative Time)
 * @param date - Thời gian đầu vào
 * @param fallbackFormat - Format ngày tháng nếu vượt quá thời gian hiển thị tương đối (Mặc định: DEFAULT)
 * @param maxRelativeDays - Số ngày tối đa để hiển thị "x ngày trước". Vượt qua số này sẽ dùng fallbackFormat. (Mặc định: 0 - nghĩa là qua 24h đổi luôn sang ngày chuẩn)
 * * @example
 * getSmartRelativeTime(date) => "2 giờ trước" hoặc "15/03/2024"
 * getSmartRelativeTime(date, DATE_FORMAT.FULL_TIME) => "2 giờ trước" hoặc "14:30 15/03/2024"
 * getSmartRelativeTime(date, DATE_FORMAT.DEFAULT, 7) => "5 ngày trước" (nếu chưa qua 7 ngày)
 */
export const getSmartRelativeTime = (
    date?: string | Date | number | null,
    fallbackFormat: string = DATE_FORMAT.FULL_TIME,
    maxRelativeDays: number = 0
): string => {
    if (!date) return '--';

    const parsedDate = dayjs(date);
    if (!parsedDate.isValid()) return '--';

    const now = dayjs();
    const diffInSeconds = now.diff(parsedDate, 'second');
    const diffInMinutes = now.diff(parsedDate, 'minute');
    const diffInHours = now.diff(parsedDate, 'hour');
    const diffInDays = now.diff(parsedDate, 'day');

    // 1. Dưới 1 phút
    if (diffInSeconds < 60) {
        return `${Math.max(0, diffInSeconds)} giây trước`; // Dùng Math.max để tránh số âm nếu giờ local bị lệch vài ms
    }

    // 2. Dưới 1 giờ
    if (diffInMinutes < 60) {
        return `${diffInMinutes} phút trước`;
    }

    // 3. Dưới 24 giờ
    if (diffInHours < 24) {
        return `${diffInHours} giờ trước`;
    }

    // 4. Cho phép hiển thị "x ngày trước" nếu nằm trong khoảng maxRelativeDays
    if (maxRelativeDays > 0 && diffInDays <= maxRelativeDays) {
        return `${diffInDays} ngày trước`;
        // Hoặc dùng: return parsedDate.fromNow(); nếu bạn muốn tin tưởng 100% vào plugin relativeTime
    }

    // 5. Nếu đã quá giới hạn tương đối, trả về ngày tháng tuyệt đối
    return parsedDate.format(fallbackFormat);
};



/**
 * 4.1 Chuyển Date sang chuẩn ISO (UTC) ĐẦU NGÀY để gửi lên Backend kiểu Instant
 * @example toApiStartDate('2024-03-15') => '2024-03-14T17:00:00.000Z'
 */
export const toApiStartDate = (
    date?: string | Date | number | null | dayjs.Dayjs
): string | undefined => {
    if (!date) return undefined;
    const parsedDate = dayjs(date);
    return parsedDate.isValid() ? parsedDate.startOf('day').toISOString() : undefined;
};

/**
 * 4.2 Chuyển Date sang chuẩn ISO (UTC) CUỐI NGÀY để gửi lên Backend kiểu Instant
 * @example toApiEndDate('2024-03-15') => '2024-03-15T16:59:59.999Z'
 */
export const toApiEndDate = (
    date?: string | Date | number | null | dayjs.Dayjs
): string | undefined => {
    if (!date) return undefined;
    const parsedDate = dayjs(date);
    return parsedDate.isValid() ? parsedDate.endOf('day').toISOString() : undefined;
};

/**
 * 4.3 Chuyển Date sang chuẩn ISO (UTC) GIỮ NGUYÊN GIỜ để gửi lên Backend
 * Dùng khi UI cho phép người dùng chọn cả ngày và giờ chi tiết.
 * @example toApiDateTime('2024-03-15 14:30:00') => '2024-03-15T07:30:00.000Z'
 */
export const toApiDateTime = (
    date?: string | Date | number | null | dayjs.Dayjs
): string | undefined => {
    if (!date) return undefined;
    const parsedDate = dayjs(date);
    // Không dùng startOf/endOf, chỉ gọi thẳng toISOString()
    return parsedDate.isValid() ? parsedDate.toISOString() : undefined;
};

/**
 * 5. Check xem một ngày có phải là hôm nay không
 */
export const isToday = (date: string | Date | number): boolean => {
    return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * Tính khoảng thời gian tham gia (Ví dụ: "4 năm trước", "3 tháng trước")
 * Dùng từ khóa "Đã tham gia" phía trước để tạo cảm giác uy tín.
 */
export const getMembershipDuration = (date?: string | Date | number | null): string => {
    if (!date) return '';
    const parsedDate = dayjs(date);
    if (!parsedDate.isValid()) return '';

    // Sử dụng fromNow() của plugin relativeTime (đã được bác init ở trên)
    // Kết quả sẽ là "4 năm trước", "vài tháng trước", v.v...
    return parsedDate.fromNow();
};

/**
 * Xuất luôn object dayjs để những chỗ nào cần xử lý phức tạp có thể dùng trực tiếp
 */
export { dayjs };
