// @/features/vips/components/vip-packages.list.tsx
'use client';

import { APP_ROUTES } from '@/config/routes';
import { useGetVips } from '@/features/vips/api/vips.queries';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/stores/auth.store';
import { formatCurrency } from '@/utils';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { Button, Card, Col, Row, Skeleton, Tag, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { VIP_PACKAGES } from '../vips.constant';

const { Title, Text } = Typography;

export function VipPackagesList() {
    // Kéo thêm colorTextLightSolid ra để dùng cho chữ màu trắng
    const {
        colorSuccess, colorError, colorTextSecondary, colorBorderSecondary, colorPrimary, colorTextLightSolid
    } = useAppTheme();

    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const { data: vipsData, isLoading } = useGetVips();

    const handleSelectPackage = (pkgId: string) => {
        if (!isAuthenticated) {
            router.push(APP_ROUTES.AUTH.LOGIN);
            return;
        }
        router.push(`${APP_ROUTES.PUBLIC.HOME}create-post?vip=${pkgId}`);
    };

    const getRealPrice = (pkgId: string, defaultPriceText: string) => {
        if (!vipsData) return defaultPriceText;

        const level = parseInt(pkgId.split('_')[1]);
        const realVip = vipsData.find(v => v.vipLevel === level);

        if (realVip && realVip.pricePerDay > 0) {
            return `${formatCurrency(realVip.pricePerDay)} / ngày`;
        }
        return 'Miễn phí';
    };

    if (isLoading) {
        return <Skeleton active paragraph={{ rows: 8 }} />;
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
                                body: { display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' },
                            }}
                        >
                            {pkg.isPopular && (
                                <div
                                    // Xóa text-white, chuyển thành token colorTextLightSolid trong style
                                    className="absolute top-0 right-0 text-[11px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg uppercase tracking-wider"
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

                            <ul className="flex-1 flex flex-col gap-4 mb-8">
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
                                type={pkg.id === 'VIP_0' ? 'default' : 'primary'}
                                size="large"
                                block
                                onClick={() => handleSelectPackage(pkg.id)}
                                className="font-semibold shadow-none"
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