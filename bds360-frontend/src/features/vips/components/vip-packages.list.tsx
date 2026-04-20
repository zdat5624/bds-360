// @/features/vips/components/vip-packages.list.tsx
'use client';

import { APP_ROUTES } from '@/config/routes';
import { VIP_PACKAGES } from '@/constants';
import { useGetVips } from '@/features/vips/api/vips.queries';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/stores/auth.store';
import { formatCurrency } from '@/utils';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { Button, Card, Col, Row, Skeleton, Tag, Typography } from 'antd';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export function VipPackagesList() {
    const {
        colorSuccess,
        colorError,
        colorTextSecondary,
        colorBorderSecondary,
        colorPrimary,
        colorTextLightSolid
    } = useAppTheme();

    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Lấy dữ liệu thực tế từ Backend (chứa giá tiền)
    const { data: vipsData, isLoading } = useGetVips();

    const handleSelectPackage = (pkgId: number) => {
        if (!isAuthenticated) {
            router.push(APP_ROUTES.AUTH.LOGIN);
            return;
        }
        // Chuyển hướng sang trang đăng tin kèm tham số gói VIP
        router.push(`${APP_ROUTES.USER.CREATE_POST}?vip=${pkgId}`);
    };

    /**
     * Lấy giá tiền từ API dựa trên ID trong constant
     * Giả định: pkg.id 1 -> level 0, pkg.id 2 -> level 1, pkg.id 3 -> level 2
     */
    const getRealPrice = (pkgId: number, defaultPriceText: string) => {
        if (!vipsData) return defaultPriceText;

        // Ánh xạ id (1,2,3) sang vipLevel (0,1,2)
        const levelMapping = pkgId - 1;
        const realVip = vipsData.find(v => v.vipLevel === levelMapping);

        if (realVip && realVip.pricePerDay > 0) {
            return `${formatCurrency(realVip.pricePerDay)} / ngày`;
        }

        return pkgId === 1 ? 'Miễn phí' : defaultPriceText;
    };

    if (isLoading) {
        return (
            <div className="py-10">
                <Skeleton active paragraph={{ rows: 10 }} />
            </div>
        );
    }

    return (
        <Row gutter={[24, 24]} className="w-full">
            {VIP_PACKAGES.map((pkg) => (
                <Col xs={24} lg={8} key={pkg.id}>
                    <div className="h-full group">
                        <Card
                            className="h-full flex flex-col relative transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl border-2"
                            style={{
                                borderColor: pkg.isPopular ? colorPrimary : colorBorderSecondary,
                            }}
                            styles={{
                                body: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    padding: '24px'
                                },
                            }}
                        >
                            {pkg.isPopular && (
                                <div
                                    className="absolute top-0 right-0 text-[11px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg uppercase tracking-wider z-10"
                                    style={{
                                        background: colorPrimary,
                                        color: colorTextLightSolid
                                    }}
                                >
                                    Phổ biến nhất
                                </div>
                            )}

                            <div className="flex flex-col items-center mb-6 text-center mt-2">
                                <Tag color={pkg.tagColor} className="text-sm font-semibold mb-3 border-none px-3 py-1">
                                    {pkg.name}
                                </Tag>
                                <Title level={3} style={{ margin: 0, marginTop: 4 }}>
                                    {getRealPrice(pkg.id, pkg.price)}
                                </Title>
                            </div>

                            <ul className="flex-1 flex flex-col gap-4 mb-8 list-none p-0">
                                {pkg.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        {feature.available ? (
                                            <CheckCircleFilled style={{ color: colorSuccess, fontSize: 18, marginTop: 2 }} />
                                        ) : (
                                            <CloseCircleFilled style={{ color: colorError, fontSize: 18, marginTop: 2, opacity: 0.5 }} />
                                        )}
                                        <span
                                            style={{ color: feature.available ? undefined : colorTextSecondary }}
                                            className={feature.available ? 'font-medium' : ''}
                                        >
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                // Gói tiêu chuẩn (id: 1) dùng kiểu default, các gói VIP dùng primary
                                type={pkg.id === 1 ? 'default' : 'primary'}
                                size="large"
                                block
                                onClick={() => handleSelectPackage(pkg.id)}
                                className="font-semibold shadow-none h-11"
                            >
                                {pkg.buttonText}
                            </Button>
                        </Card>
                    </div>
                </Col>
            ))}
        </Row>
    );
}