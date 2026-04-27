// @/features/users/components/verification-detail.modal.tsx
'use client';

import { VerificationSubmission } from '@/features/users/api/types';
import { DATE_FORMAT, formatDate } from '@/utils/date.util';
import { Col, Descriptions, Image, Modal, Row, Tag, Typography } from 'antd';

const { Title, Text } = Typography;

interface VerificationDetailModalProps {
    submission: VerificationSubmission | null;
    onClose: () => void;
}

export function VerificationDetailModal({ submission, onClose }: VerificationDetailModalProps) {
    if (!submission) return null;

    const getStatusTag = (status: string) => {
        switch (status) {
            case 'APPROVED': return <Tag color="green">Đã duyệt</Tag>;
            case 'REJECTED': return <Tag color="red">Từ chối</Tag>;
            default: return <Tag color="blue">Đang chờ</Tag>;
        }
    };

    return (
        <Modal
            title="Chi tiết hồ sơ xác thực"
            open={!!submission}
            onCancel={onClose}
            footer={null}
            width={700}
            destroyOnHidden
            centered
        >
            <div className="flex flex-col gap-6 mt-4">

                {/* --- Thông tin chung --- */}
                <Descriptions bordered column={1} size="small" labelStyle={{ width: '150px', fontWeight: 600 }}>
                    <Descriptions.Item label="Mã hồ sơ">#{submission.id}</Descriptions.Item>
                    <Descriptions.Item label="Ngày nộp">
                        {formatDate(submission.createdAt, DATE_FORMAT.FULL_TIME)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        {getStatusTag(submission.status)}
                    </Descriptions.Item>

                    {submission.status !== 'PENDING' && (
                        <>
                            <Descriptions.Item label="Ngày xử lý">
                                {submission.reviewedAt ? formatDate(submission.reviewedAt, DATE_FORMAT.FULL_TIME) : '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ghi chú duyệt">
                                <Text type="secondary" className="italic">{submission.reviewNote || 'Không có ghi chú'}</Text>
                            </Descriptions.Item>
                        </>
                    )}
                </Descriptions>

                {/* --- Hiển thị hình ảnh --- */}
                <div>
                    <Title level={5} className="!mb-4">Tài liệu đính kèm</Title>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <div className="flex flex-col gap-2">
                                <Text className="font-medium text-center">Mặt trước</Text>
                                {/* Dùng Image của Antd để có tính năng Preview phóng to */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden bg-slate-50 h-[200px] flex items-center justify-center">
                                    <Image
                                        src={submission.idCardFront}
                                        alt="Mặt trước CMND/CCCD"
                                        className="max-h-[200px] object-contain"
                                    />
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} sm={12}>
                            <div className="flex flex-col gap-2">
                                <Text className="font-medium text-center">Mặt sau</Text>
                                <div className="border border-gray-200 rounded-lg overflow-hidden bg-slate-50 h-[200px] flex items-center justify-center">
                                    <Image
                                        src={submission.idCardBack}
                                        alt="Mặt sau CMND/CCCD"
                                        className="max-h-[200px] object-contain"
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>

            </div>
        </Modal>
    );
}