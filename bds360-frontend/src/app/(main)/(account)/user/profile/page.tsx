// @/app/(main)/(account)/user/profile/page.tsx
'use client';
import { UpdateProfileForm } from '@/features/users';
import {
  UserOutlined
} from '@ant-design/icons';
import { Divider, Typography } from 'antd';

const { Title, Text } = Typography;

export default function ProfilePage() {
  return (
    // Khống chế độ rộng tối đa (max-w-4xl) để form không bị bè ra quá đà trên màn hình to
    <>
      {/* --- HEADER TRANG --- */}
      <div >
        <Title level={3} className="!m-0 flex items-center gap-2">
          <UserOutlined />
          Thông tin cá nhân
        </Title>
        <Text type="secondary">
          Quản lý thông tin cá nhân, cách thức liên hệ và thiết lập hồ sơ của bạn.
        </Text>
      </div>

      <Divider className="!my-4" />

      {/* --- KHU VỰC FORM (Trực tiếp, không viền, không hộp bao quanh) --- */}
      <div className="max-w-4xl">
        <UpdateProfileForm />
      </div>
    </>
  );
}