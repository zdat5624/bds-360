'use client';

import { AppModal } from '@/components/base/app.modal';
import { useAuthStore } from '@/stores/auth.store';
import { formatCurrency } from '@/utils';
import { PlusOutlined, UnorderedListOutlined, WalletOutlined } from '@ant-design/icons';
import { Button, Result, Space, Typography } from 'antd';

const { Text, Title } = Typography;

type Props = {
    isOpen: boolean;
    onContinue: () => void; // Hành động khi muốn đăng tiếp
    onManage: () => void;   // Hành động khi muốn về trang quản lý
};

export default function CreatePostSuccessModal({ isOpen, onContinue, onManage }: Props) {
    const user = useAuthStore((state) => state.user);

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onManage} // Mặc định đóng modal sẽ dẫn về trang quản lý
            title={<div />}
            width={450}
            footer={null}
        >
            <div className="text-center py-4">
                <Result
                    status="success"
                    title={<Title level={3} className="!mb-0">Đăng tin thành công!</Title>}
                    subTitle={
                        <Text className="text-gray-500 block mt-2">
                            Tin đăng của bạn đã được hệ thống ghi nhận và đang chờ phê duyệt.
                        </Text>
                    }
                />

                {/* HIỂN THỊ SỐ DƯ MỚI */}
                <div className="bg-blue-50/50 rounded-2xl p-5 mx-4 mb-8 border border-blue-100/50">
                    <Space direction="vertical" size={4} className="w-full">
                        <div className="flex items-center justify-center gap-2 text-blue-400">
                            <WalletOutlined />
                            <Text type="secondary" className="text-[10px] uppercase tracking-widest font-bold text-blue-500/70">
                                Số dư tài khoản hiện tại
                            </Text>
                        </div>
                        <Title level={2} className="!m-0 !text-blue-600">
                            {user ? formatCurrency(user.balance) : '---'}
                        </Title>
                    </Space>
                </div>

                <div className="px-4 flex flex-col gap-3">
                    {/* NÚT CHÍNH: TIẾP TỤC ĐĂNG TIN */}
                    <Button
                        type="primary"
                        block
                        size="large"
                        icon={<PlusOutlined />}
                        className="h-12 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 font-semibold rounded-xl"
                        onClick={onContinue}
                    >
                        Tiếp tục đăng tin mới
                    </Button>

                    {/* NÚT PHỤ: QUẢN LÝ TIN ĐĂNG */}
                    <Button
                        block
                        size="large"
                        icon={<UnorderedListOutlined />}
                        className="h-12 rounded-xl border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-600"
                        onClick={onManage}
                    >
                        Quản lý tin đăng
                    </Button>
                </div>
            </div>
        </AppModal>
    );
}