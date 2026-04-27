// @/features/users/components/verification-section.tsx
'use client';

import { useUploadImages } from '@/features/media';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/stores/auth.store';
import { CheckCircleFilled, ClockCircleFilled, CloseCircleFilled, HistoryOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Alert, Button, Card, Col, Form, message, Row, Spin, Typography, Upload } from 'antd';
import { useState } from 'react';
import { useSubmitVerification } from '../api/user.mutations';
import { useGetLatestVerification } from '../api/user.queries';
import { VerificationHistoryModal } from './verification-history.modal';
const { Text } = Typography;
const { Dragger } = Upload;
type CustomRequestOptions = Parameters<
    NonNullable<UploadProps['customRequest']>
>[0];
export function VerificationSection() {
    const { colorPrimary } = useAppTheme();
    const user = useAuthStore((state) => state.user);

    // Hooks API
    const { data: latestReq, isLoading: isFetchingLatest } = useGetLatestVerification(user?.id || 0, !!user?.id);
    const { mutate: submitVerification, isPending: isSubmitting } = useSubmitVerification(user?.id);
    const { mutateAsync: uploadImages } = useUploadImages();

    // States
    const [frontImage, setFrontImage] = useState<string>('');
    const [backImage, setBackImage] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    if (!user) return null;

    // --- HANDLERS ---
    const handleCustomUpload = async (
        options: CustomRequestOptions,
        type: 'front' | 'back'
    ) => {
        const { file, onSuccess, onError } = options;
        const uploadFile = file as File;

        const isLt20M = uploadFile.size / 1024 / 1024 < 20;
        if (!isLt20M) {
            message.error('Ảnh phải nhỏ hơn 20MB!');
            onError?.(new Error('Kích thước quá lớn'));
            return;
        }

        setIsUploading(true);
        try {
            const urls = await uploadImages({ files: [uploadFile] });
            if (urls && urls.length > 0) {
                if (type === 'front') setFrontImage(urls[0]);
                else setBackImage(urls[0]);
                onSuccess?.('ok');
            }
        } catch (error) {
            onError?.(error as Error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = () => {
        if (!frontImage || !backImage) {
            message.warning('Vui lòng tải lên đầy đủ mặt trước và mặt sau của CMND/CCCD.');
            return;
        }
        submitVerification({ idCardFront: frontImage, idCardBack: backImage }, {
            onSuccess: () => {
                message.success('Đã gửi yêu cầu xác thực thành công!');
                setFrontImage('');
                setBackImage('');
            }
        });
    };

    // --- RENDER LOGIC THEO TRẠNG THÁI ---
    if (isFetchingLatest) {
        return <div className="p-10 flex justify-center"><Spin /></div>;
    }

    const status = latestReq?.status;
    const isVerified = user.isVerified || status === 'APPROVED';

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-end">
                <Button icon={<HistoryOutlined />} onClick={() => setIsHistoryModalOpen(true)}>
                    Lịch sử xác thực
                </Button>
            </div>

            {/* TRẠNG THÁI 1: ĐÃ XÁC THỰC */}
            {isVerified && (
                <Alert
                    title={<span className="font-bold text-green-700">Tài khoản đã được xác thực</span>}
                    description="Hồ sơ của bạn đã được kiểm duyệt. Dấu tích xanh uy tín đã được cấp cho tài khoản của bạn."
                    type="success"
                    showIcon
                    icon={<CheckCircleFilled />}
                    className="border-green-300 bg-green-50/50 rounded-xl py-4"
                />
            )}

            {/* TRẠNG THÁI 2: ĐANG CHỜ DUYỆT */}
            {!isVerified && status === 'PENDING' && (
                <Alert
                    title={<span className="font-bold text-blue-700">Hồ sơ đang được chờ duyệt</span>}
                    description="Yêu cầu xác thực của bạn đã được gửi và đang chờ ban quản trị kiểm duyệt. Vui lòng quay lại sau."
                    type="info"
                    showIcon
                    icon={<ClockCircleFilled />}
                    className="border-blue-300 bg-blue-50/50 rounded-xl py-4"
                />
            )}

            {/* TRẠNG THÁI 3: BỊ TỪ CHỐI (Hiển thị lý do và cho phép nộp lại) */}
            {!isVerified && status === 'REJECTED' && (
                <Alert
                    message={<span className="font-bold text-red-700">Yêu cầu xác thực bị từ chối</span>}
                    description={
                        <div className="flex flex-col gap-1 mt-1">
                            <Text type="danger">Lý do: {latestReq?.reviewNote || 'Ảnh mờ hoặc không hợp lệ.'}</Text>
                            <Text>Vui lòng chụp lại ảnh rõ nét và nộp lại hồ sơ bên dưới.</Text>
                        </div>
                    }
                    type="error"
                    showIcon
                    icon={<CloseCircleFilled />}
                    className="border-red-300 bg-red-50/50 rounded-xl py-4 mb-2"
                />
            )}

            {/* FORM NỘP ẢNH (Chỉ hiện khi Chưa từng nộp HOẶC bị Từ chối) */}
            {!isVerified && status !== 'PENDING' && (
                <Card className="rounded-2xl border-gray-200 shadow-sm" styles={{ body: { padding: '24px' } }}>
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Row gutter={[24, 24]}>
                            {/* MẶT TRƯỚC */}
                            <Col xs={24} md={12}>
                                <Form.Item label={<span className="font-medium">Mặt trước CMND/CCCD <span className="text-red-500">*</span></span>}>
                                    <Dragger
                                        customRequest={(opt) => handleCustomUpload(opt, 'front')}
                                        showUploadList={false}
                                        disabled={isUploading || isSubmitting}
                                        className="bg-slate-50 hover:bg-blue-50/50 transition-colors"
                                        style={{ padding: frontImage ? 0 : '30px 0', overflow: 'hidden' }}
                                    >
                                        {frontImage ? (
                                            <div className="relative w-full h-[180px] group">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={frontImage} alt="Mặt trước" className="w-full h-full object-cover rounded-lg" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                                    <span className="text-white font-medium">Bấm để thay đổi</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="ant-upload-drag-icon"><InboxOutlined style={{ color: colorPrimary }} /></p>
                                                <p className="ant-upload-text px-4 text-sm">Nhấp hoặc kéo thả ảnh mặt trước vào đây</p>
                                            </>
                                        )}
                                    </Dragger>
                                </Form.Item>
                            </Col>

                            {/* MẶT SAU */}
                            <Col xs={24} md={12}>
                                <Form.Item label={<span className="font-medium">Mặt sau CMND/CCCD <span className="text-red-500">*</span></span>}>
                                    <Dragger
                                        customRequest={(opt) => handleCustomUpload(opt, 'back')}
                                        showUploadList={false}
                                        disabled={isUploading || isSubmitting}
                                        className="bg-slate-50 hover:bg-blue-50/50 transition-colors"
                                        style={{ padding: backImage ? 0 : '30px 0', overflow: 'hidden' }}
                                    >
                                        {backImage ? (
                                            <div className="relative w-full h-[180px] group">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={backImage} alt="Mặt sau" className="w-full h-full object-cover rounded-lg" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                                    <span className="text-white font-medium">Bấm để thay đổi</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="ant-upload-drag-icon"><InboxOutlined style={{ color: colorPrimary }} /></p>
                                                <p className="ant-upload-text px-4 text-sm">Nhấp hoặc kéo thả ảnh mặt sau vào đây</p>
                                            </>
                                        )}
                                    </Dragger>
                                </Form.Item>
                            </Col>
                        </Row>

                        <div className="flex justify-end mt-4">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={isSubmitting || isUploading}
                                disabled={!frontImage || !backImage}
                                className="px-8 shadow-sm"
                            >
                                Gửi yêu cầu xác thực
                            </Button>
                        </div>
                    </Form>
                </Card>
            )}

            {/* MODAL LỊCH SỬ */}
            <VerificationHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
            />
        </div>
    );
}