// @/app/(main)/(account)/user/payments/result/page.tsx
'use client';

import { useAppTheme } from '@/hooks/use-app-theme';
// 👇 Tận dụng triệt để các util đã định nghĩa
import { DATE_FORMAT, dayjs, formatCurrency } from '@/utils';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Descriptions, Result, Typography } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';

const { Title, Text } = Typography;

export default function PaymentResultPage() {
    // --- HOOKS & THEME ---
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        colorBgContainer,
        colorBorderSecondary,
        colorError,
        colorSuccess,
        colorWarning,
        colorFillAlter,
    } = useAppTheme();

    // --- XỬ LÝ DỮ LIỆU ĐỒNG BỘ TRỰC TIẾP TỪ URL ---
    // Không cần useState/useEffect vì dữ liệu đã có sẵn để render ngay

    const status = searchParams.get('status');
    const orderInfo = searchParams.get('orderInfo') ? decodeURIComponent(searchParams.get('orderInfo')!) : '--';
    const transactionId = searchParams.get('transactionId') || '--';
    const transactionStatus = searchParams.get('transactionStatus');
    const totalPriceRaw = searchParams.get('totalPrice');
    const paymentTimeRaw = searchParams.get('paymentTime');

    // 1. Xử lý thời gian VNPAY (YYYYMMDDHHmmss) sử dụng dayjs từ util
    let formattedPaymentTime = '--';
    if (paymentTimeRaw) {
        const parsedDate = dayjs(paymentTimeRaw, 'YYYYMMDDHHmmss');
        if (parsedDate.isValid()) {
            // Dùng định dạng chuẩn hệ thống đã cấu hình: 'HH:mm DD/MM/YYYY'
            formattedPaymentTime = parsedDate.format(DATE_FORMAT.FULL_TIME);
        } else {
            formattedPaymentTime = paymentTimeRaw;
        }
    }

    // 2. Format số tiền sử dụng formatCurrency từ number.util.ts
    const displayAmount = totalPriceRaw
        ? formatCurrency(parseInt(totalPriceRaw) / 100)
        : '0 ₫';

    // --- KIỂM TRA TRẠNG THÁI ---
    const isSuccess = status === '1';
    const isCancelled = transactionStatus === '02';

    let resultStatus: 'success' | 'warning' | 'error' = 'error';
    let resultIcon = <CloseCircleOutlined />;
    let resultTitle = 'Thanh toán thất bại!';
    let resultSubTitle = 'Giao dịch của bạn không thể hoàn tất. Vui lòng kiểm tra lại số dư hoặc liên hệ hỗ trợ.';
    let transactionStatusText = 'Thất bại';
    let statusThemeColor = colorError;

    if (isSuccess) {
        resultStatus = 'success';
        resultIcon = <CheckCircleOutlined />;
        resultTitle = 'Thanh toán thành công!';
        resultSubTitle = 'Giao dịch nạp tiền của bạn đã được xử lý thành công. Cảm ơn bạn đã sử dụng dịch vụ BDS360.';
        transactionStatusText = 'Thành công';
        statusThemeColor = colorSuccess;
    } else if (isCancelled) {
        resultStatus = 'warning';
        resultIcon = <WarningOutlined />;
        resultTitle = 'Giao dịch đã bị hủy!';
        resultSubTitle = 'Bạn đã hủy bỏ quá trình thanh toán. Không có khoản tiền nào bị trừ.';
        transactionStatusText = 'Đã hủy';
        statusThemeColor = colorWarning;
    }

    // --- RENDER GIAO DIỆN CHÍNH ---
    return (
        <div
            className="max-w-3xl mx-auto p-2 md:p-4 shadow-sm"
            style={{
                backgroundColor: colorBgContainer,
                borderColor: colorBorderSecondary
            }}
        >
            <Result
                className="!p-0 !m-0 mb-8"
                status={resultStatus}
                icon={
                    <div style={{ color: statusThemeColor, fontSize: '60px' }}>
                        {resultIcon}
                    </div>
                }
                title={<Title level={3} className="!mt-4">{resultTitle}</Title>}
                subTitle={<Text type="secondary" className="text-base">{resultSubTitle}</Text>}
                extra={[
                    <Button
                        key="transactions"
                        type="primary"
                        size="medium"
                        className="px-8 font-medium"
                        onClick={() => router.push('/user/transactions')}
                    >
                        Lịch sử giao dịch
                    </Button>,
                    <Button
                        key="home"
                        size="medium"
                        className="px-8"
                        onClick={() => router.push('/')}
                    >
                        Về trang chủ
                    </Button>,
                ]}
            />

            <Descriptions
                title={
                    <Title
                        level={4}
                        className="!mb-4 border-b pb-2"
                        style={{ borderColor: colorBorderSecondary }}
                    >
                        Chi tiết giao dịch
                    </Title>
                }
                bordered
                column={1}
                size="middle"
                styles={{
                    label: {
                        width: '180px',
                        fontWeight: 500,
                        backgroundColor: colorFillAlter
                    },
                    content: {
                        fontWeight: 500
                    }
                }}
            >
                <Descriptions.Item label="Trạng thái">
                    <span style={{ fontWeight: 600, color: statusThemeColor }}>
                        {transactionStatusText}
                    </span>
                </Descriptions.Item>

                <Descriptions.Item label="Số tiền">
                    <span className="text-lg">{displayAmount}</span>
                </Descriptions.Item>

                <Descriptions.Item label="Nội dung chuyển khoản">
                    {orderInfo}
                </Descriptions.Item>

                <Descriptions.Item label="Mã giao dịch VNPAY">
                    <Text copyable={{ text: transactionId }}>
                        {transactionId}
                    </Text>
                </Descriptions.Item>

                <Descriptions.Item label="Thời gian hệ thống">
                    {formattedPaymentTime}
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
}