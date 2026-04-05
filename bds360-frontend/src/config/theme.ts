// --- src/config/theme.ts ---
import { theme, type ThemeConfig } from 'antd';
import { inter } from './fonts';

export const antdTheme: ThemeConfig = {
    // 2. Kích hoạt thuật toán thu nhỏ toàn hệ thống
    algorithm: theme.compactAlgorithm,

    token: {
        colorPrimary: '#1677ff',
        fontFamily: inter.style.fontFamily,

    },
    components: {

    }
};