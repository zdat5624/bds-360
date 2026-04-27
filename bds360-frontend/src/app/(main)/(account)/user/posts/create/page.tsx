'use client';

import { APP_ROUTES } from '@/config/routes';
import { CreatePostFormValues, PostCreatePayload, useCreatePost } from '@/features/posts';
import { useGetVips } from '@/features/vips/api/vips.queries';
import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined, CloseOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Grid, message, Steps, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Import các bước và Modal
import { AUTH_QUERY_KEYS } from '@/features/auth';
import { getErrorMessage } from '@/utils/error.util';
import { useQueryClient } from '@tanstack/react-query';
import { CancelPostCreationModal } from './CancelPostCreationModal';
import { ConfirmPostCreationModal } from './confirm-post-creation.modal';
import CreatePostSuccessModal from './create-post-success.modal';
import { Step1General } from './step-1-general';
import { Step2Location } from './step-2-location';
import { Step3DetailsMedia } from './step-3-details-media';
import { Step4Checkout } from './step-4-checkout';
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const STEPS = [
    { title: 'Thông tin chung', description: 'Loại, giá, diện tích' },
    { title: 'Vị trí', description: 'Địa chỉ, bản đồ' },
    { title: 'Chi tiết & Hình ảnh', description: 'Thông số, ảnh thực tế' },
    { title: 'Gói tin & Thanh toán', description: 'Hoàn tất' },
];

export default function CreatePostPage() {
    const router = useRouter();
    const screens = useBreakpoint();
    const [form] = Form.useForm<CreatePostFormValues>();
    const queryClient = useQueryClient();
    const [currentStep, setCurrentStep] = useState(0);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const { data: vips } = useGetVips();
    const { mutateAsync: createPost, isPending } = useCreatePost();

    const isMobile = !screens.md;

    // Các hàm logic giữ nguyên...
    const handleNext = async () => {
        try {
            let fieldsToValidate: string[] = [];

            // Chỉ validate các trường thuộc bước hiện tại
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
            message.error('Vui lòng hoàn thành chính xác thông tin ở bước này.');
        }
    };
    // Hành động 1: Tiếp tục đăng tin mới (Reset từ đầu)
    const handleContinuePosting = () => {
        form.resetFields();       // Xóa sạch dữ liệu cũ trong form
        setCurrentStep(0);        // Đưa về bước 1
        setIsSuccessModalOpen(false); // Đóng modal thành công
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu trang
    };

    // Hành động 2: Về trang quản lý
    const handleGoToManage = () => {
        setIsSuccessModalOpen(false);
        router.push(APP_ROUTES.USER.MY_POSTS);
    };
    const handlePrev = () => {
        setCurrentStep((prev) => prev - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- LOGIC SUBMIT ---

    // Bước đệm: Kiểm tra toàn bộ form lần cuối và hiện Modal xác nhận tóm tắt
    const handlePreSubmit = async () => {
        try {
            await form.validateFields();
            setIsConfirmModalOpen(true);
        } catch (error) {
            message.error('Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại.');
        }
    };

    // Thực hiện gọi API thật sự sau khi user bấm OK ở Modal xác nhận
    const handleActualSubmit = async () => {
        try {
            const formValues = form.getFieldsValue(true);

            // Xử lý giá trị số
            const numericPrice = typeof formValues.price === 'string'
                ? parseInt(formValues.price.replace(/\D/g, ''))
                : formValues.price;

            // 2. Ép kiểu một cách minh bạch thay vì dùng any
            const payload: PostCreatePayload = {
                ...formValues,
                price: numericPrice,
            };

            // 3. Bây giờ gọi hàm mà không cần 'as any' nữa
            await createPost(payload, {
                onSuccess: (data) => {
                    queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.account() });
                    console.log("Thanh toán thành công cho bài đăng:", data.id);
                },
            });

            // Hậu kỳ UI (vẫn phải viết ở đây hoặc trong onSuccess)
            setIsConfirmModalOpen(false);
            setIsSuccessModalOpen(true);

        } catch (error) {
            console.error('Submit Error:', error);
            // const apiMessage = error?.response?.data?.message;
            // message.error(apiMessage || 'Đã xảy ra lỗi khi tạo bài viết.');
            message.error(getErrorMessage(error));

        }
    };

    const handleConfirmCancel = () => {
        setIsCancelModalOpen(false);
        router.push(APP_ROUTES.USER.MY_POSTS);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return <Step1General form={form} />;
            case 1: return <Step2Location form={form} />;
            case 2: return <Step3DetailsMedia form={form} />;
            case 3: return <Step4Checkout form={form} />;
            default: return null;
        }
    };

    return (
        // Container chính
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 pb-12 animate-fade-in px-4 md:px-6">

            {/*  HEADER: Đã bỏ md:px-0 để kế thừa padding của container cha */}
            <div className="flex flex-col gap-1">
                <Title level={3} className="!m-0 flex items-center gap-2 text-blue-600">
                    <PlusCircleOutlined /> Đăng tin bất động sản mới
                </Title>
                <Text type="secondary">
                    Hệ thống sẽ hướng dẫn bạn từng bước để tối ưu bài đăng nhất.
                </Text>
            </div>

            <Card
                className="!border-0 overflow-hidden"
                styles={{ body: { padding: 0 } }}
            >
                {/* STEPPER: Nằm trong vùng xám nhạt */}
                <div className="bg-gray-50/50 py-4 border-b border-gray-100">
                    <Steps
                        current={currentStep}
                        size={isMobile ? "small" : "medium"}
                        className=" !mx-auto !w-full"
                        items={isMobile
                            ? STEPS.map(s => ({ title: s.title }))
                            : STEPS.map(s => ({ title: s.title, description: s.description }))
                        }
                    />
                </div>

                {/*  NỘI DUNG CHÍNH (FORM & ACTIONS): Dùng padding đồng nhất */}
                <div className='mt-4'>
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{ type: 'SALE', numberOfDays: 10 }}
                        requiredMark="optional"
                    >
                        {renderStepContent()}
                    </Form>

                    <Divider className="my-8" />

                    {/* ACTIONS */}
                    <div className="flex justify-between items-center mt-6">
                        <Button
                            onClick={() => setIsCancelModalOpen(true)}
                            type="dashed"
                            icon={<CloseOutlined />}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            disabled={isPending}
                            size="large"
                        >
                            Hủy bỏ
                        </Button>

                        <div className="flex gap-3">
                            {currentStep > 0 && (
                                <Button
                                    onClick={handlePrev}
                                    size="large"
                                    disabled={isPending}
                                    icon={<ArrowLeftOutlined />}
                                >
                                    Quay lại
                                </Button>
                            )}

                            {currentStep < STEPS.length - 1 ? (
                                <Button
                                    type="primary"
                                    onClick={handleNext}
                                    size="large"
                                    className="bg-blue-600 min-w-[120px] shadow-lg shadow-blue-100"
                                >
                                    Tiếp tục <ArrowRightOutlined />
                                </Button>
                            ) : (
                                <Button
                                    type="primary"
                                    onClick={handlePreSubmit}
                                    size="large"
                                    icon={<CheckOutlined />}
                                    className="bg-green-600 hover:!bg-green-500 min-w-[160px] border-none shadow-lg shadow-green-100"
                                    loading={isPending}
                                >
                                    Xác nhận đăng tin
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            {/* MODALS GIỮ NGUYÊN */}
            <ConfirmPostCreationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleActualSubmit}
                isLoading={isPending}
                formData={form.getFieldsValue(true)}
                vips={vips}
            />
            <CreatePostSuccessModal
                isOpen={isSuccessModalOpen}
                onContinue={handleContinuePosting}
                onManage={handleGoToManage}
            />

            <CancelPostCreationModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
            />
        </div>
    );
}