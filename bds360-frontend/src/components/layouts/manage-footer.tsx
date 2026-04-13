// @/components/layouts/manage-footer.tsx
'use client';

import { useAppTheme } from '@/hooks/use-app-theme';
import { Layout, Typography } from 'antd';

const { Footer: AntdFooter } = Layout;
const { Text } = Typography;

export function ManageFooter() {
    const { colorBgContainer, colorBorderSecondary } = useAppTheme();

    return (
        <AntdFooter
            className="text-center py-4"
            style={{
                background: colorBgContainer,
                borderTop: `1px solid ${colorBorderSecondary}`,
            }}
        >
            <Text type='secondary' className="text-sm">
                © 2026 Hệ thống Quản trị BDS 360.
            </Text>
        </AntdFooter>
    );
}