// @/app/(main)/(account)/user/vip/page.tsx
'use client';

import { VipPackagesList } from '@/features/vips';
import { Divider, Typography } from 'antd';

const { Title, Text } = Typography;

export default function UserVipPage() {
    return (
        <div className="">
            {/* --- HEADER TRANG (Đồng bộ với các trang Profile, Password) --- */}
            <div className="">
                <Title level={3} style={{ margin: 0 }}>Bảng giá Gói VIP</Title>
                <Text type="secondary">
                    Lựa chọn gói hiển thị ưu tiên khi đăng tin để nhận được nhiều lượt xem hơn và tiếp cận khách hàng tiềm năng nhanh chóng.
                </Text>
            </div>

            <Divider className="!mb-7 !mt-6" />

            {/* --- KHU VỰC DANH SÁCH GÓI --- */}
            <div className="max-w-6xl ">
                <VipPackagesList />
            </div>
        </div>
    );
}