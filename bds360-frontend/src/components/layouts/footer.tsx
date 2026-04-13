// @/components/layouts/footer.tsx
'use client';

import { Layout, theme, Typography } from 'antd';

const { Footer: AntdFooter } = Layout;
const { Text } = Typography;

export function Footer() {
    // Lấy thêm token colorBorderSecondary tương tự như Header
    const {
        token: { colorBgContainer, colorBorderSecondary },
    } = theme.useToken();

    return (
        <AntdFooter
            className="py-6 text-center"
            style={{
                background: colorBgContainer,
                borderTop: `1px solid ${colorBorderSecondary}`,   // Viền trên
                // Giảm từ 0.06 xuống 0.04 hoặc 0.03
                boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)',     // Bóng đổ ngược lên trên (chú ý số -2px)
                position: 'relative',                             // Cần thêm relative để shadow không bị che khuất
                zIndex: 10                                        // Đảm bảo Footer đè bóng lên phần Content
            }}
        >
            <Text type="secondary">
                © 2026 BDS 360. Nền tảng đăng tin bất động sản.
            </Text>
        </AntdFooter>
    );
}