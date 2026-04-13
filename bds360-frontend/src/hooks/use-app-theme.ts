// @/hooks/use-app-theme.ts
import { theme } from 'antd';

export function useAppTheme() {
    const { token } = theme.useToken();

    return {
        // Trả về toàn bộ token nếu cần dùng các biến hiếm
        token,
        isDark: false, // Dành cho logic Dark Mode sau này

        // 1. Nhóm Màu Nền (Backgrounds)
        colorBgContainer: token.colorBgContainer, // Nền trắng tinh (Card, Header, Sider)
        colorBgLayout: token.colorBgLayout,       // Nền xám nhạt (Nền tổng của trang, nền thẻ phụ)
        colorPrimaryBg: token.colorPrimaryBg,     // Nền màu chủ đạo siêu nhạt (Dùng cho Avatar vừa rồi)
        colorBgElevated: token.colorBgElevated,   // Nền nổi (Dùng cho Popup, Dropdown, Modal)

        // 2. Nhóm Màu Chữ (Typography) - Bắt buộc phải có
        colorText: token.colorText,                   // Chữ chính (Tiêu đề, nội dung chính)
        colorTextSecondary: token.colorTextSecondary, // Chữ phụ (Mô tả, Email, Caption)
        colorTextTertiary: token.colorTextTertiary,   // Chữ mờ (Gợi ý Placeholder, Disabled)

        // 3. Nhóm Màu Viền (Borders)
        colorBorder: token.colorBorder,                   // Viền tiêu chuẩn (Khung Input, Select)
        colorBorderSecondary: token.colorBorderSecondary, // Viền nhạt (Đường Divider, viền Sidebar)

        // 4. Nhóm Màu Trạng Thái (Semantic / Status) - Cực kỳ quan trọng cho hệ thống
        colorPrimary: token.colorPrimary, // Màu chủ đạo (Nút bấm chính, Link)
        colorSuccess: token.colorSuccess, // Màu xanh lá (Duyệt thành công, Giao dịch hoàn tất)
        colorWarning: token.colorWarning, // Màu vàng/cam (Chờ duyệt, Cảnh báo)
        colorError: token.colorError,     // Màu đỏ (Lỗi, Xóa tin, Khóa tài khoản)
        colorInfo: token.colorInfo,       // Màu xanh lơ (Thông báo hệ thống thông thường)

        // 5. Hình khối
        borderRadius: token.borderRadius,
    };
}