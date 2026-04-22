// @/features/posts/components/saved-posts-sidebar.tsx
'use client';

import { Typography } from 'antd';
import Link from 'next/link';

const { Title } = Typography;

const UTILITIES = [
    { title: 'Tư vấn phong thủy', href: '#' },
    { title: 'Dự tính chi phí làm nhà', href: '#' },
    { title: 'Tính lãi suất', href: '#' },
    { title: 'Quy trình xây nhà', href: '#' },
    { title: 'Xem tuổi làm nhà', href: '#' },
];

export function SavedPostsSidebar() {
    return (
        // Áp dụng chuẩn xác màu nền, padding và bo góc bạn yêu cầu
        <div className="bg-[#f2f2f2] p-5 rounded-lg sticky top-24">
            <Title level={5} className="!mb-4 !text-base font-bold text-gray-800">
                Hỗ trợ tiện ích
            </Title>
            <div className="flex flex-col gap-3">
                {UTILITIES.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className="text-gray-600 hover:text-blue-600 transition-colors text-sm flex items-center gap-2 group"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-500 transition-colors shrink-0" />
                        <span className="line-clamp-1">{item.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}