// @/app/(main)/(account)/user/profile/page.tsx
'use client';

import { Divider, Typography } from 'antd';

const { Title, Text } = Typography;

export default function ProfilePage() {
  return (
    <>
      <div className="mb-6">
        <Title level={3} style={{ margin: 0 }}>Thông tin cá nhân</Title>
        <Text type="secondary">
          Quản lý thông tin cá nhân và cách thức liên hệ của bạn.
        </Text>
      </div>

      <Divider className="my-6" />

      <div className="min-h-[300px] border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
        [ Component Form Hồ Sơ Sẽ Đặt Ở Đây ]
      </div>
    </>
  );
}