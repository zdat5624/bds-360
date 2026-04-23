// @/components/layouts/manage-footer.tsx
'use client';

import { useAppTheme } from '@/hooks/use-app-theme';
import { Layout, Space, Typography } from 'antd';
import Link from 'next/link';

const { Footer: AntdFooter } = Layout;
const { Text } = Typography;

export function ManageFooter() {
    const { colorBorderSecondary, colorTextSecondary } = useAppTheme();

    return (
        <AntdFooter
            className="!py-5 !px-4 md:!px-6"
            style={{
                borderTop: `1px solid ${colorBorderSecondary}`,
            }}
        >
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">

                {/* LEFT */}
                <div className="flex flex-col">
                    <Text className="text-sm font-medium">
                        © 2026 BDS 360 Admin
                    </Text>
                    <Text
                        style={{ color: colorTextSecondary }}
                        className="text-xs"
                    >
                        Hệ thống quản trị bất động sản
                    </Text>
                </div>

                {/* RIGHT */}
                <Space size="middle" wrap className="text-xs">
                    <Link href="#">
                        <Text type="secondary" className="hover:!text-blue-600 transition-colors">
                            Chính sách
                        </Text>
                    </Link>
                    <Link href="#">
                        <Text type="secondary" className="hover:!text-blue-600 transition-colors">
                            Điều khoản
                        </Text>
                    </Link>
                    <Link href="#">
                        <Text type="secondary" className="hover:!text-blue-600 transition-colors">
                            Hỗ trợ
                        </Text>
                    </Link>
                </Space>
            </div>
        </AntdFooter>
    );
}