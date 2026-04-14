// --- src/config/theme.ts ---
import { theme, type ThemeConfig } from 'antd';
import { inter } from './fonts';

export const antdTheme: ThemeConfig = {
    // 2. Kích hoạt thuật toán thu nhỏ toàn hệ thống
    algorithm: theme.compactAlgorithm,

    token: {
        colorPrimary: '#1677ff',
        fontFamily: `${inter.style.fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,

    },
    components: {

    }
};

export const customColors = {
    colorGoogle: '#DB4437',
    colorFacebook: '#1877F2',
} as const;