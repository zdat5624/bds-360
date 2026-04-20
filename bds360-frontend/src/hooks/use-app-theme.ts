// @/hooks/use-app-theme.ts
import { customColors } from '@/config';
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
        colorPrimaryBg: token.colorPrimaryBg,     // Nền primary siêu nhạt (Avatar, Item được chọn)
        colorBgElevated: token.colorBgElevated,   // Nền nổi (Popup, Dropdown, Modal)
        colorBgMask: token.colorBgMask,           // Màu màn mờ đen (Phía sau Modal/Drawer)


        colorFillAlter: token.colorFillAlter,

        // 2. Nhóm Màu Chữ (Typography)
        colorText: token.colorText,                   // Chữ chính (Tiêu đề, nội dung)
        colorTextSecondary: token.colorTextSecondary, // Chữ phụ (Mô tả, Email, Caption)
        colorTextTertiary: token.colorTextTertiary,   // Chữ mờ (Placeholder, icon phụ)
        colorTextLightSolid: token.colorTextLightSolid, // Chữ trắng (Nằm trên nút Primary hoặc nền đậm)
        colorBgTextHover: token.colorBgTextHover,
        colorTextPlaceholder: token.colorTextPlaceholder,

        // 3. Nhóm Màu Viền (Borders)
        colorBorder: token.colorBorder,                   // Viền tiêu chuẩn (Khung Input, Select)
        colorBorderSecondary: token.colorBorderSecondary, // Viền nhạt (Đường Divider, viền Sidebar)

        // 4. Nhóm Màu Trạng Thái Đậm (Semantic Solid) - Dùng cho Text, Icon, Nút bấm
        colorPrimary: token.colorPrimary, // Xanh chủ đạo
        colorSuccess: token.colorSuccess, // Xanh lá (Thành công)
        colorWarning: token.colorWarning, // Cam/Vàng (Cảnh báo, Chờ duyệt)
        colorError: token.colorError,     // Đỏ (Lỗi, Xóa, Thất bại)
        colorInfo: token.colorInfo,       // Xanh dương nhạt (Thông tin)

        // 5. Nhóm Màu Trạng Thái Nhạt (Semantic Background) - Dùng cho nền thẻ Tag, Alert, Badge
        colorSuccessBg: token.colorSuccessBg, // Nền xanh lá siêu nhạt
        colorWarningBg: token.colorWarningBg, // Nền cam siêu nhạt
        colorErrorBg: token.colorErrorBg,     // Nền đỏ siêu nhạt
        colorInfoBg: token.colorInfoBg,       // Nền xanh lơ siêu nhạt

        // 6. Nhóm Vô hiệu hóa (Disabled)
        colorBgContainerDisabled: token.colorBgContainerDisabled, // Nền xám mờ (Input bị disable)
        colorTextDisabled: token.colorTextDisabled,               // Chữ xám mờ (Chữ bị disable)

        // 7. Hình khối & Không gian
        borderRadius: token.borderRadius,
        boxShadow: token.boxShadow,                   // Bóng đổ chuẩn cho Card
        boxShadowSecondary: token.boxShadowSecondary, // Bóng đổ đậm hơn cho Dropdown/Modal

        colorSplit: token.colorSplit,
        colorTextQuaternary: token.colorTextQuaternary,

        colorFillTertiary: token.colorFillTertiary,
        colorTextDescription: token.colorTextDescription,
        colorFillSecondary: token.colorFillSecondary,

        borderRadiusSM: token.borderRadiusSM,

        colorGoogle: customColors.colorGoogle,
        colorFacebook: customColors.colorFacebook,

        getAlphaPrimary: (opacity: number) => `rgba(22, 119, 255, ${opacity})`,
    };
}