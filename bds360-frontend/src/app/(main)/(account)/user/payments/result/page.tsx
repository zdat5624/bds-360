// @/app/(main)/(account)/user/payments/result/page.tsx
'use client';

import { APP_ROUTES } from '@/config/routes';
import { useAppTheme } from '@/hooks/use-app-theme';
import { DATE_FORMAT, dayjs, formatCurrency } from '@/utils';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Descriptions, Result, Skeleton, Typography } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const { Title, Text } = Typography;

// 1. TÁCH LOGIC XỬ LÝ URL VÀO COMPONENT CON
function PaymentResultContent() {
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

    const status = searchParams.get('status');
    const orderInfo = searchParams.get('orderInfo') ? decodeURIComponent(searchParams.get('orderInfo')!) : '--';
    const transactionId = searchParams.get('transactionId') || '--';
    const transactionStatus = searchParams.get('transactionStatus');
    const totalPriceRaw = searchParams.get('totalPrice');
    const paymentTimeRaw = searchParams.get('paymentTime');

    // Xử lý thời gian VNPAY
    let formattedPaymentTime = '--';
    if (paymentTimeRaw) {
        const parsedDate = dayjs(paymentTimeRaw, 'YYYYMMDDHHmmss');
        if (parsedDate.isValid()) {
            formattedPaymentTime = parsedDate.format(DATE_FORMAT.FULL_TIME);
        } else {
            formattedPaymentTime = paymentTimeRaw;
        }
    }

    // Format số tiền
    const displayAmount = totalPriceRaw
        ? formatCurrency(parseInt(totalPriceRaw) / 100)
        : '0 ₫';

    // Kiểm tra trạng thái
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

    return (
        <div
            className="max-w-3xl mx-auto p-2 md:p-4 shadow-sm rounded-lg"
            style={{
                backgroundColor: colorBgContainer,
                border: `1px solid ${colorBorderSecondary}`
            }}
        >
            <Result
                className="!p-0 !m-0 mb-8 mt-6"
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
                        size="large"
                        className="px-8 font-medium"
                        onClick={() => router.push(APP_ROUTES.USER.PAYMENTS)}
                    >
                        Lịch sử giao dịch
                    </Button>,
                    <Button
                        key="home"
                        size="large"
                        className="px-8"
                        onClick={() => router.push(APP_ROUTES.PUBLIC.HOME)}
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

// 2. KHUNG XƯƠNG CHỜ (FALLBACK) CHỐNG VỠ LAYOUT
function PaymentResultFallback() {
    const { colorBgContainer, colorBorderSecondary } = useAppTheme();

    return (
        <div
            className="max-w-3xl mx-auto p-4 md:p-8 shadow-sm rounded-lg flex flex-col items-center gap-6"
            style={{
                backgroundColor: colorBgContainer,
                border: `1px solid ${colorBorderSecondary}`
            }}
        >
            <div className="flex flex-col items-center gap-4 w-full mt-6">
                <Skeleton.Avatar active size={72} shape="circle" />
                <Skeleton active paragraph={{ rows: 2 }} title={{ width: 250 }} className="text-center flex flex-col items-center" />
                <div className="flex gap-4 mt-4">
                    <Skeleton.Button active size="large" style={{ width: 160 }} />
                    <Skeleton.Button active size="large" style={{ width: 140 }} />
                </div>
            </div>

            <div className="w-full mt-8">
                <Skeleton.Input active size="small" style={{ width: 150, marginBottom: 16 }} />
                <Skeleton active paragraph={{ rows: 4 }} title={false} />
            </div>
        </div>
    );
}

// 3. PAGE CHÍNH BỌC SUSPENSE
export default function PaymentResultPage() {
    return (
        <div className="w-full py-8 px-4">
            <Suspense fallback={<PaymentResultFallback />}>
                <PaymentResultContent />
            </Suspense>
        </div>
    );
}