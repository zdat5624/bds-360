// @/app/(main)/(account)/user/profile/page.tsx
'use client';
import { UpdateProfileForm } from '@/features/users';
import { VerificationSection } from '@/features/users/components/verification-section'; // 🌟 Import mới
import {
  IdcardOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Divider, Typography } from 'antd';

const { Title, Text } = Typography;

export default function ProfilePage() {
  return (
    <>
      {/* ==========================================
          KHU VỰC 1: THÔNG TIN CÁ NHÂN
      ========================================== */}
      <div>
        <Title level={3} className="!m-0 flex items-center gap-2">
          <UserOutlined />
          Thông tin cá nhân
        </Title>
        <Text type="secondary">
          Quản lý thông tin cá nhân, cách thức liên hệ và thiết lập hồ sơ của bạn.
        </Text>
      </div>

      <Divider className="!my-4" />

      <div className="max-w-4xl mb-12">
        <UpdateProfileForm />
      </div>

      {/* ==========================================
          KHU VỰC 2: XÁC THỰC TÀI KHOẢN
      ========================================== */}
      <div>
        <Title level={3} className="!m-0 flex items-center gap-2">
          <IdcardOutlined />
          Xác thực tài khoản
        </Title>
        <Text type="secondary">
          Cung cấp CMND/CCCD để tăng độ uy tín cho tài khoản của bạn trên hệ thống.
        </Text>
      </div>

      <Divider className="!my-4" />

      <div className="max-w-4xl">
        <VerificationSection />
      </div>
    </>
  );
}