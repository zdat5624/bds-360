// @/components/layouts/footer.tsx
'use client';

import { useAppTheme } from '@/hooks/use-app-theme';
import {
    EnvironmentOutlined,
    FacebookOutlined,
    GlobalOutlined,
    MailOutlined,
    PhoneOutlined,
    QuestionCircleOutlined,
    YoutubeOutlined
} from '@ant-design/icons';
import { Button, Divider, Input, Layout, Typography } from 'antd';
import Link from 'next/link';
import { ZaloIcon } from '../icons';

const { Footer: AntdFooter } = Layout;
const { Title, Text } = Typography;

export function Footer() {
    const {
        token: { colorBgContainer, colorBorderSecondary },
    } = useAppTheme();

    return (
        <AntdFooter
            className="!p-0" // Xóa padding mặc định của Antd để dùng Tailwind
            style={{
                background: colorBgContainer,
                borderTop: `1px solid ${colorBorderSecondary}`,
                boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.03)',
                position: 'relative',
                zIndex: 10,
            }}
        >
            <div className="container mx-auto px-4 !pt-5 !pb-10 max-w-7xl">
                {/* =========================================================
                    TOP SECTION: GRID 4 CỘT
                ========================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

                    {/* CỘT 1: THÔNG TIN CÔNG TY */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="inline-block mb-2">
                            <Title level={3} className="!m-0 !text-blue-600 tracking-wider">
                                <strong>BDS360</strong>
                            </Title>
                        </Link>
                        <Text className="font-bold text-gray-800">CÔNG TY CỔ PHẦN BDS 360</Text>

                        <div className="flex items-start gap-2 text-gray-600 text-sm">
                            <EnvironmentOutlined className="mt-1" />
                            <span>Tầng 31, Landmark Tower, Phường Yên Hòa, Cầu Giấy, Hà Nội, Việt Nam</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <PhoneOutlined />
                            <span>(024) 3562 5939 - (024) 3562 5940</span>
                        </div>

                        {/* App Download Badges */}
                        <div className="flex gap-3 mt-2">
                            <img src="https://staticfile.batdongsan.com.vn/images/app/footer_qr_code.svg" alt="QR Code" className="w-16 h-16 object-contain" />
                            <div className="flex flex-col justify-between">
                                <Link href="#" target="_blank">
                                    <img src="https://staticfile.batdongsan.com.vn/images/mobile/footer/google-play.png" alt="Google Play" className="h-7 object-contain" />
                                </Link>
                                <Link href="#" target="_blank">
                                    <img src="https://staticfile.batdongsan.com.vn/images/mobile/footer/app_store.png" alt="App Store" className="h-7 object-contain" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* CỘT 2: TỔNG ĐÀI & HƯỚNG DẪN */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <PhoneOutlined className="text-2xl text-gray-400" />
                                <div className="flex flex-col">
                                    <Text className="text-xs text-gray-500">Hotline</Text>
                                    <Text className="font-bold text-base">1900 1881</Text>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <QuestionCircleOutlined className="text-2xl text-gray-400" />
                                <div className="flex flex-col">
                                    <Text className="text-xs text-gray-500">Hỗ trợ khách hàng</Text>
                                    <Text className="font-bold text-base">trogiup.bds360.vn</Text>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MailOutlined className="text-2xl text-gray-400" />
                                <div className="flex flex-col">
                                    <Text className="text-xs text-gray-500">Chăm sóc khách hàng</Text>
                                    <Text className="font-bold text-base">hotro@bds360.vn</Text>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Text className="font-bold text-gray-800 block mb-3">HƯỚNG DẪN</Text>
                            <ul className="flex flex-col gap-2 text-sm text-gray-600">
                                <li><Link href="#" className="!text-gray-700 !hover:text-blue-600 transition-colors">Về chúng tôi</Link></li>
                                <li><Link href="#" className="!text-gray-700 !hover:text-blue-600 !transition-colors">Báo giá và hỗ trợ</Link></li>
                                <li><Link href="#" className="!text-gray-700 !hover:text-blue-600 !transition-colors">Câu hỏi thường gặp</Link></li>
                                <li><Link href="#" className="!text-gray-700 !hover:text-blue-600 !transition-colors">Góp ý báo lỗi</Link></li>
                                <li><Link href="#" className="!text-gray-700 !hover:text-blue-600 !transition-colors">Sitemap</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* CỘT 3: QUY ĐỊNH & CHI NHÁNH */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <Text className="font-bold text-gray-800 block mb-3">QUY ĐỊNH</Text>
                            <ul className="flex flex-col gap-2 text-sm">
                                <li><Link href="#" className="!text-gray-700 !hover:text-blue-600 !transition-colors">Quy định đăng tin</Link></li>
                                <li><Link href="#" className="!text-gray-700 !hover:text-blue-600 !transition-colors">Quy chế hoạt động</Link></li>
                                <li><Link href="#" className="!text-gray-700 !hover:text-blue-600 !transition-colors">Điều khoản thỏa thuận</Link></li>
                                <li><Link href="#" className="!text-gray-700 !hover:text-blue-600 !transition-colors">Chính sách bảo mật</Link></li>
                                <li><Link href="#" className="!text-gray-700 !hover:text-blue-600 !transition-colors">Giải quyết khiếu nại</Link></li>
                            </ul>
                        </div>

                        <div>
                            <Text className="font-bold text-gray-800 block mb-3">CHI NHÁNH BDS360</Text>
                            <ul className="flex flex-col gap-3 text-sm text-gray-600">
                                <li>
                                    <span className="font-medium text-gray-700 block">TP. Hồ Chí Minh</span>
                                    <span className="text-xs">Tầng 2, Tháp B Tòa nhà Viettel, 285 CMT8, Q.10</span>
                                </li>
                                <li>
                                    <span className="font-medium text-gray-700 block">Đà Nẵng</span>
                                    <span className="text-xs">Tầng 9 Vĩnh Trung Plaza, 255-257 Hùng Vương</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* CỘT 4: NHẬN TIN & NGÔN NGỮ */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <Text className="font-bold text-gray-800 block mb-3">ĐĂNG KÝ NHẬN TIN</Text>
                            <div className="flex gap-2">
                                <Input placeholder="Nhập email của bạn" className="rounded-md" />
                                <Button type="primary" className="rounded-md">Gửi</Button>
                            </div>
                        </div>

                        <div>
                            <Text className="font-bold text-gray-800 block mb-3">QUỐC GIA & NGÔN NGỮ</Text>
                            <Button className="w-full flex justify-between items-center text-left" icon={<GlobalOutlined />}>
                                <span>Việt Nam</span>
                            </Button>
                        </div>
                    </div>
                </div>

                <Divider className="my-6 border-gray-200" />

                {/* =========================================================
                    BOTTOM SECTION: COPYRIGHT & SOCIAL
                ========================================================= */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

                    {/* Legal Info */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500 leading-relaxed">
                        <div>
                            <span className="font-medium text-gray-700 block mb-1 text-sm">Copyright © 2024 - 2026 BDS360</span>
                            Giấy ĐKKD số 0104630479 do Sở KHĐT TP Hà Nội cấp lần đầu ngày 02/06/2010<br />
                            Giấy phép thiết lập trang TTĐT tổng hợp trên mạng số 191/GP-TTĐT do Sở TTTT Hà Nội cấp ngày 31/08/2023<br />
                        </div>
                        <div>
                            Chịu trách nhiệm nội dung GP ICP: Nguyễn Văn A<br />
                            Chịu trách nhiệm sàn GDTMĐT: Trần Thị B<br />
                            Quy chế, quy định giao dịch có hiệu lực từ 08/08/2024<br />
                            {`Ghi rõ nguồn "BDS360.vn" khi phát hành lại thông tin từ website này.`}
                        </div>
                    </div>

                    {/* Right side: BCT Logo & Socials */}
                    <div className="flex flex-col items-start lg:items-end gap-4 shrink-0">
                        <Link href="#" target="_blank">
                            <img src="https://staticfile.batdongsan.com.vn/images/newhome/da-dang-ki-bct.svg" alt="Đã đăng ký bộ công thương" className="h-10 object-contain" />
                        </Link>

                        {/*  KHU VỰC CHỨA CÁC ICON MẠNG XÃ HỘI */}
                        <div className="flex items-center gap-4">
                            <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors" title="Facebook">
                                <FacebookOutlined className="text-2xl" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-red-600 transition-colors" title="Youtube">
                                <YoutubeOutlined className="text-2xl" />
                            </Link>
                            {/*  Đã sửa w-[1.4rem] h-[1.4rem] thành w-6 h-6 để bằng với text-2xl */}
                            <Link href="https://zalo.me" target="_blank" className="text-gray-400 hover:text-blue-500 transition-colors" title="Zalo">
                                <ZaloIcon className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </AntdFooter>
    );
}