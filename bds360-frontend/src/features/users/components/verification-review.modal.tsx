// @/features/users/components/verification-review.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { GENDER_LABEL, USER_ROLE_COLOR, USER_ROLE_LABEL } from '@/constants';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatDateTime, getErrorMessage } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Avatar, Button, Descriptions, Flex, Form, Image, Input, Radio, Skeleton, Tag, Typography } from 'antd';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { VerificationSubmission } from '../api/types';
import { useReviewVerification } from '../api/user.mutations';
import { useGetUserById } from '../api/user.queries';
import { VERIFICATION_STATUS_LABEL } from '../users.constant';
import { ReviewVerificationFormValues, reviewVerificationSchema } from '../users.schema';

const { Text, Title } = Typography;

interface VerificationReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: VerificationSubmission | null;
}

export function VerificationReviewModal({ isOpen, onClose, submission }: VerificationReviewModalProps) {
    const { message } = App.useApp();
    const { colorFillAlter } = useAppTheme();
    const { mutateAsync: reviewVerification, isPending } = useReviewVerification(submission?.userId);

    const { data: userDetail, isFetching: isFetchingUser } = useGetUserById(
        submission?.userId as number,
        !!submission?.userId && isOpen
    );

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<ReviewVerificationFormValues>({
        resolver: zodResolver(reviewVerificationSchema),
        defaultValues: {
            requestId: 0,
            status: 'APPROVED',
            note: '',
        },
    });

    const currentStatus = watch('status');

    useEffect(() => {
        if (isOpen && submission) {
            reset({
                requestId: submission.id,
                status: submission.status === 'PENDING' ? 'APPROVED' : submission.status,
                note: submission.reviewNote || '',
            });
        }
    }, [isOpen, submission, reset]);

    const onSubmit: SubmitHandler<ReviewVerificationFormValues> = async (data) => {
        try {
            await reviewVerification(data);
            message.success('Đã cập nhật trạng thái xác thực');
            onClose();
        } catch (error) {
            // Tận dụng hàm getErrorMessage cực gọn gàng
            const errorMsg = getErrorMessage(error);
            message.error(errorMsg);
        }
    };

    if (!submission) return null;

    const isPendingStatus = submission.status === 'PENDING';

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            title="Chi tiết yêu cầu xác thực"
            width={800}
            isLoading={isPending}
        >
            <div className="flex flex-col gap-6">
                <Descriptions
                    title={<span className="text-[15px]">Thông tin tài khoản</span>}
                    bordered
                    column={2}
                    size="small"
                    labelStyle={{ width: '130px', backgroundColor: colorFillAlter, fontWeight: 500 }}
                >
                    <Descriptions.Item label="Người dùng" span={2}>
                        <Flex align="center" gap={12}>
                            <Avatar src={submission.userAvatar}>{submission.userName.charAt(0)}</Avatar>
                            <Flex vertical>
                                <Text strong>{submission.userName}</Text>
                                <Text type="secondary" className="text-[12px]">{submission.userEmail}</Text>
                            </Flex>
                        </Flex>
                    </Descriptions.Item>

                    {isFetchingUser ? (
                        <Descriptions.Item span={2}>
                            <Skeleton active paragraph={{ rows: 2 }} className="mt-2" />
                        </Descriptions.Item>
                    ) : userDetail ? (
                        <>
                            <Descriptions.Item label="Số điện thoại">
                                {userDetail.phone || '--'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Giới tính">
                                {userDetail.gender ? GENDER_LABEL[userDetail.gender] : '--'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Vai trò">
                                <Tag color={USER_ROLE_COLOR[userDetail.role]} className="border-none m-0">
                                    {USER_ROLE_LABEL[userDetail.role]}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày tham gia">
                                {formatDateTime(userDetail.createdAt)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={2}>
                                {userDetail.address || '--'}
                            </Descriptions.Item>
                        </>
                    ) : null}
                </Descriptions>

                <Descriptions
                    title={<span className="text-[15px]">Thông tin xét duyệt</span>}
                    bordered
                    column={1}
                    size="small"
                    labelStyle={{ width: '160px', backgroundColor: colorFillAlter, fontWeight: 500 }}
                >
                    <Descriptions.Item label="Ngày gửi">
                        {formatDateTime(submission.createdAt)}
                    </Descriptions.Item>
                    {!isPendingStatus && (
                        <>
                            <Descriptions.Item label="Trạng thái hiện tại">
                                <Text strong type={submission.status === 'APPROVED' ? 'success' : 'danger'}>
                                    {VERIFICATION_STATUS_LABEL[submission.status]}
                                </Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Người duyệt">
                                {submission.reviewedBy || '--'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian duyệt">
                                {submission.reviewedAt ? formatDateTime(submission.reviewedAt) : '--'}
                            </Descriptions.Item>
                            {submission.reviewNote && (
                                <Descriptions.Item label="Ghi chú">
                                    {submission.reviewNote}
                                </Descriptions.Item>
                            )}
                        </>
                    )}
                </Descriptions>

                <div>
                    <Text strong className="mb-2 block text-[15px]">Ảnh giấy tờ tùy thân (CCCD/CMND)</Text>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="flex flex-col gap-2">
                            <Text type="secondary" className="text-center">Mặt trước</Text>
                            <Image
                                src={submission.idCardFront}
                                alt="Mặt trước"
                                className="rounded-lg object-cover w-full h-[220px] border border-gray-200"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Text type="secondary" className="text-center">Mặt sau</Text>
                            <Image
                                src={submission.idCardBack}
                                alt="Mặt sau"
                                className="rounded-lg object-cover w-full h-[220px] border border-gray-200"
                            />
                        </div>
                    </div>
                </div>

                {isPendingStatus && (
                    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className=" !p-4 border-t border-gray-200 mt-2">
                        <Title level={5} className="!mt-0 !mb-4">Phê duyệt yêu cầu</Title>

                        <Form.Item
                            label={<span className="font-medium">Quyết định</span>}
                            validateStatus={errors.status ? 'error' : ''}
                            help={errors.status?.message}
                        >
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Radio.Group {...field} optionType="button" buttonStyle="solid">
                                        <Radio
                                            value="APPROVED"
                                            className="
                                                !border-green-600 
                                                !text-green-600 
                                                hover:!text-green-500
                                                [&.ant-radio-button-wrapper-checked]:!bg-green-600
                                                [&.ant-radio-button-wrapper-checked]:!border-green-600
                                                [&.ant-radio-button-wrapper-checked]:!text-white
                                            "
                                        >
                                            Phê duyệt
                                        </Radio>

                                        <Radio
                                            value="REJECTED"
                                            className="
                                                !border-red-600 
                                                !text-red-600 
                                                hover:!text-red-500
                                                [&.ant-radio-button-wrapper-checked]:!bg-red-600
                                                [&.ant-radio-button-wrapper-checked]:!border-red-600
                                                [&.ant-radio-button-wrapper-checked]:!text-white
                                            "
                                        >
                                            Từ chối
                                        </Radio>
                                    </Radio.Group>
                                )}
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="font-medium">Ghi chú / Lý do {currentStatus === 'REJECTED' && <span className="text-red-500">*</span>}</span>}
                            validateStatus={errors.note ? 'error' : ''}
                            help={errors.note?.message}
                            className="!mb-0"
                        >
                            <Controller
                                name="note"
                                control={control}
                                render={({ field }) => (
                                    <Input.TextArea
                                        {...field}
                                        rows={3}
                                        placeholder={currentStatus === 'REJECTED' ? "Bắt buộc nhập lý do từ chối để người dùng cập nhật lại" : "Nhập ghi chú (không bắt buộc)"}
                                    />
                                )}
                            />
                        </Form.Item>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button onClick={onClose} disabled={isPending}>Hủy</Button>
                            <Button type="primary" htmlType="submit" loading={isPending}>
                                Xác nhận
                            </Button>
                        </div>
                    </Form>
                )}
            </div>
        </AppModal>
    );
}