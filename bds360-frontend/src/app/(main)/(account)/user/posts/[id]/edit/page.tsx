'use client';

import { ConfirmModal } from '@/components/base/confirm.modal';
import { APP_ROUTES } from '@/config/routes';
import {
    PostUpdatePayload,
    UpdatePostFormValues,
    useGetPostById,
    useUpdatePost
} from '@/features/posts';
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    CheckOutlined,
    CloseOutlined,
    EditOutlined
} from '@ant-design/icons';
import { Button, Card, Divider, Form, Grid, message, Result, Skeleton, Steps, Typography } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

// Import lại các Step từ thư mục create để tái sử dụng
import { getErrorMessage } from '@/utils/error.util';
import { Step1General } from '../../create/step-1-general';
import { Step2Location } from '../../create/step-2-location';
import { Step3DetailsMedia } from '../../create/step-3-details-media';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const STEPS = [
    { title: 'Thông tin chung', description: 'Loại, giá, diện tích' },
    { title: 'Vị trí', description: 'Địa chỉ, bản đồ' },
    { title: 'Chi tiết & Hình ảnh', description: 'Thông số, ảnh thực tế' },
];

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const postId = Number(params.id);
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [form] = Form.useForm<UpdatePostFormValues>();

    const [currentStep, setCurrentStep] = useState(0);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    const { data: post, isLoading: isLoadingPost, isError } = useGetPostById(postId, !!postId);
    const { mutateAsync: updatePost, isPending: isUpdating } = useUpdatePost();

    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

    // useEffect(() => {
    //     if (post) {
    //         form.setFieldsValue({
    //             id: post.id,
    //             title: post.title,
    //             description: post.description,
    //             type: post.type,
    //             price: post.price,
    //             area: post.area,
    //             categoryId: post.category?.id,
    //             provinceCode: post.provinceCode,
    //             districtCode: post.districtCode,
    //             wardCode: post.wardCode,
    //             streetAddress: post.streetAddress,
    //             latitude: post.latitude,
    //             longitude: post.longitude,
    //             imageUrls: post.images?.sort((a, b) => a.orderIndex - b.orderIndex).map(img => img.url) || [],
    //             listingDetail: post.listingDetail || undefined,
    //         });
    //     }
    // }, [post, form]);

    const initialFormValues = useMemo(() => {
        if (!post) return undefined;
        return {
            id: post.id,
            title: post.title,
            description: post.description,
            type: post.type,
            price: post.price,
            area: post.area,
            categoryId: post.category?.id,
            provinceCode: post.provinceCode,
            districtCode: post.districtCode,
            wardCode: post.wardCode,
            streetAddress: post.streetAddress,
            latitude: post.latitude,
            longitude: post.longitude,
            imageUrls: post.images?.sort((a, b) => a.orderIndex - b.orderIndex).map(img => img.url) || [],
            listingDetail: post.listingDetail || undefined,
        };
    }, [post]);

    const handleNext = async () => {
        try {
            let fieldsToValidate: string[] = [];

            if (currentStep === 0) {
                fieldsToValidate = ['type', 'categoryId', 'title', 'description', 'price', 'area'];
            } else if (currentStep === 1) {
                fieldsToValidate = ['provinceCode', 'districtCode', 'streetAddress'];
            } else if (currentStep === 2) {
                fieldsToValidate = ['imageUrls'];
            }

            await form.validateFields(fieldsToValidate);
            setCurrentStep((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            message.error('Vui lòng hoàn thành đầy đủ thông tin bắt buộc ở bước này.');
        }
    };

    const handlePrev = () => {
        setCurrentStep((prev) => prev - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePreSubmit = async () => {
        try {
            await form.validateFields();
            setIsSubmitModalOpen(true); // Mở modal xác nhận
        } catch (error) {
            message.error('Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại các trường báo đỏ.');
        }
    };

    const handleActualSubmit = async () => {
        try {
            const formValues = form.getFieldsValue(true);

            let numericPrice = formValues.price;
            if (typeof numericPrice === 'string') {
                numericPrice = parseInt((numericPrice as string).replace(/\D/g, ''), 10);
            }

            let numericArea = formValues.area;
            if (typeof numericArea === 'string') {
                numericArea = parseFloat(numericArea);
            }

            const payload: PostUpdatePayload = {
                ...formValues,
                id: postId,
                price: numericPrice,
                area: numericArea,
            };

            await updatePost(payload);

            setIsSubmitModalOpen(false); // Đóng modal
            message.success('Cập nhật tin đăng thành công!');
            router.push(APP_ROUTES.USER.MY_POSTS);

        } catch (error: any) {
            console.error('Update Error:', error);
            if (error?.errorFields) {
                message.error('Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại các trường báo đỏ.');
                return;
            }
            message.error(getErrorMessage(error));
        }
    };

    const handleConfirmCancel = () => {
        setIsCancelModalOpen(false);
        router.push(APP_ROUTES.USER.MY_POSTS);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return <Step1General form={form as any} />;
            case 1: return <Step2Location form={form as any} />;
            case 2: return <Step3DetailsMedia form={form as any} />;
            default: return null;
        }
    };

    if (isLoadingPost) {
        return (
            <div className="w-full max-w-4xl mx-auto  pb-12 animate-fade-in flex flex-col gap-6">
                <Skeleton active paragraph={{ rows: 2 }} />
                <Card styles={{ body: { padding: 0 } }} className="!border-0 shadow-sm rounded-2xl overflow-hidden">
                    <Skeleton active paragraph={{ rows: 12 }} />
                </Card>
            </div>
        );
    }

    if (isError || !post) {
        return (
            <div className="w-full max-w-4xl mx-auto pt-10">
                <Result
                    status="404"
                    title="Không tìm thấy tin đăng"
                    subTitle="Tin đăng này có thể đã bị xóa hoặc bạn không có quyền chỉnh sửa."
                    extra={<Button type="primary" size="large" onClick={() => router.push(APP_ROUTES.USER.MY_POSTS)}>Về trang quản lý</Button>}
                />
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 pb-12 animate-fade-in px-4 md:px-6">
            <div className="flex flex-col gap-1">
                <Title level={3} className="!m-0 flex items-center gap-2 text-blue-600">
                    <EditOutlined /> Chỉnh sửa tin đăng
                </Title>
                <Text type="secondary">Cập nhật lại thông tin bài viết #{postId}</Text>
            </div>

            <Card className="!border-0 rounded-2xl overflow-hidden shadow-sm" styles={{ body: { padding: 0 } }}>
                <div className="bg-gray-50/50 py-4 border-b border-gray-100">
                    <Steps
                        current={currentStep}
                        size={isMobile ? "small" : "default"}
                        className="!w-full mx-auto"
                        items={isMobile
                            ? STEPS.map(s => ({ title: s.title }))
                            : STEPS.map(s => ({ title: s.title, description: s.description }))
                        }
                    />
                </div>

                <div className='mt-4'>
                    <Form
                        form={form}
                        layout="vertical"
                        requiredMark="optional"
                        initialValues={initialFormValues}
                    >
                        {renderStepContent()}
                    </Form>

                    <Divider className="my-8" />

                    <div className="flex justify-between items-center mt-6">
                        <Button
                            onClick={() => setIsCancelModalOpen(true)}
                            type="dashed"
                            icon={<CloseOutlined />}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            disabled={isUpdating}
                            size="large"
                        >
                            Hủy bỏ
                        </Button>

                        <div className="flex gap-3">
                            {currentStep > 0 && (
                                <Button onClick={handlePrev} size="large" disabled={isUpdating} icon={<ArrowLeftOutlined />}>
                                    Quay lại
                                </Button>
                            )}

                            {currentStep < STEPS.length - 1 ? (
                                <Button type="primary" onClick={handleNext} size="large" className="bg-blue-600 min-w-[120px] shadow-lg shadow-blue-100">
                                    Tiếp tục <ArrowRightOutlined />
                                </Button>
                            ) : (
                                <Button
                                    type="primary"
                                    onClick={handlePreSubmit} //  Gọi hàm mở Modal thay vì gọi API
                                    size="large"
                                    icon={<CheckOutlined />}
                                    className="bg-green-600 hover:!bg-green-500 min-w-[160px] border-none shadow-lg shadow-green-100"
                                >
                                    Lưu thay đổi
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            <ConfirmModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Hủy bỏ thay đổi?"
                content="Mọi thông tin bạn vừa chỉnh sửa sẽ không được lưu lại. Bạn có chắc chắn muốn thoát?"
                okText="Đồng ý thoát"
                cancelText="Ở lại chỉnh sửa"

            />

            <ConfirmModal
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                onConfirm={handleActualSubmit}
                isLoading={isUpdating} // Giữ loading state cho nút Xác nhận
                title="Lưu các thay đổi?"
                content="Bạn có chắc chắn muốn lưu lại các thông tin vừa cập nhật cho bài viết này không?"
                okText="Lưu bài viết"
                cancelText="Quay lại"
                type="info"
            />
        </div>
    );
}