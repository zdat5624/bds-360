// @/app/(main)/(public)/posts/[id]/post-seller-sidebar.tsx
'use client';

import { PostAuthor } from '@/features/posts/api/types';
import { cn } from '@/lib/utils'; // Hoặc dùng template string nếu bạn không có hàm cn
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Typography } from 'antd';
import React, { useState } from 'react';

const { Title, Text } = Typography;

interface PostSellerSidebarProps {
    user: PostAuthor;
    className?: string;
    style?: React.CSSProperties;
}

export const PostSellerSidebar: React.FC<PostSellerSidebarProps> = ({
    user,
    className,
    style
}) => {
    const [showPhone, setShowPhone] = useState(false);

    return (
        <div
            className={cn(
                "sticky top-[80px] bg-white p-6 rounded-md text-center shadow-[0_0_10px_rgba(0,0,0,0.12)] z-20",
                className
            )}
            style={style}
        >
            <Avatar
                size={70}
                src={user.avatar}
                icon={<UserOutlined />}
                className="mb-4"
            />
            <Text type="secondary" className="block text-[11px] uppercase tracking-tighter mb-1">
                Đăng bởi
            </Text>
            <Title level={5} className="!m-0 !mb-6 !text-base">
                {user.name}
            </Title>

            <div className="flex flex-col gap-3">
                <Button
                    type="primary"
                    size="large"
                    block
                    icon={<PhoneOutlined />}
                    className="bg-[#00b156] border-none hover:!bg-[#009348] h-12 font-bold text-lg rounded-md flex items-center justify-center"
                    onClick={() => setShowPhone(true)}
                >
                    {showPhone ? user.phone : `${user.phone.slice(0, 4)} *** ***`}
                </Button>

                <Button
                    size="large"
                    block
                    icon={<MailOutlined />}
                    className="h-11 text-sm rounded-md flex items-center justify-center"
                >
                    Gửi email
                </Button>
            </div>
        </div>
    );
};