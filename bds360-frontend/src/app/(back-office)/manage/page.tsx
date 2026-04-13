// @/app/(back-office)/manage/page.tsx
'use client';

import { Typography } from 'antd';

const { Title } = Typography;

export default function ManageDashboardPage() {
    return (
        <div>
            <Title level={3} style={{ margin: 0, marginBottom: '24px' }}>
                Tổng quan hệ thống
            </Title>

            <div className="min-h-[400px] bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                [ Biểu đồ và thông số thống kê sẽ đặt ở đây ]
            </div>
        </div>
    );
}