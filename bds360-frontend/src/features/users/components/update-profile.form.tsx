// @/features/users/components/update-profile.form.tsx
'use client';

import { GENDER_OPTIONS } from '@/constants';
import { useUploadImages } from '@/features/media'; // Import mutation upload ảnh
import { useUpdateProfile } from '@/features/users/api/user.mutations';
import { UpdateProfileFormValues, updateProfileSchema } from '@/features/users/users.schema';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/stores/auth.store';
import { CameraOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Button, Col, Form, Input, Row, Select, Upload, message } from 'antd';
import type { UploadProps } from 'antd/es/upload';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

export function UpdateProfileForm() {
    const { colorPrimary, colorPrimaryBg } = useAppTheme();

    // 1. GLOBAL STATE & MUTATIONS
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
    const { mutate: uploadImages, isPending: isUploadingImage } = useUploadImages();

    // 2. FORM SETUP
    const { control, handleSubmit, reset, setValue, watch, formState: { isDirty } } = useForm<UpdateProfileFormValues>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            id: user?.id || 0,
            name: user?.name || '',
            gender: user?.gender,
            phone: user?.phone || '',
            address: user?.address || '',
            avatar: user?.avatar || '',
        },
    });

    // Theo dõi giá trị avatar hiện tại trong form để hiển thị UI
    const currentAvatar = watch('avatar');

    useEffect(() => {
        if (user) {
            reset({
                id: user.id,
                name: user.name,
                gender: user.gender,
                phone: user.phone,
                address: user.address || '',
                avatar: user.avatar || '',
            });
        }
    }, [user, reset]);

    // 3. HANDLERS
    const onSubmit = (values: UpdateProfileFormValues) => {
        updateProfile(values, {
            onSuccess: (updatedUser) => {
                setUser(updatedUser);
                message.success('Cập nhật thông tin thành công!');
                reset(values);
            },
        });
    };

    // Cấu hình customRequest cho Antd Upload để chặn cơ chế upload mặc định và dùng API của mình
    const uploadProps: UploadProps = {
        name: 'file',
        showUploadList: false, // Ẩn danh sách file mặc định của Antd
        customRequest: ({ file, onSuccess, onError }) => {
            // Ép kiểu vì Antd trả về RcFile (kế thừa File)
            const uploadFile = file as File;

            // Optional: Bạn có thể validate size/type ở đây nếu muốn chặn sớm trước khi gọi API
            const isLt50M = uploadFile.size / 1024 / 1024 < 50;
            if (!isLt50M) {
                message.error('Ảnh phải nhỏ hơn 50MB!');
                onError?.(new Error('Kích thước quá lớn'));
                return;
            }

            uploadImages({ files: [uploadFile] }, {
                onSuccess: (urls) => {
                    if (urls && urls.length > 0) {
                        // Lấy URL đầu tiên (vì mình chỉ cho upload 1 avatar)
                        const newAvatarUrl = urls[0];
                        // Ghi đè vào React Hook Form, { shouldDirty: true } đảm bảo nút Lưu sẽ sáng lên
                        setValue('avatar', newAvatarUrl, { shouldDirty: true, shouldValidate: true });
                        onSuccess?.('ok');
                    }
                },
                onError: (err) => {
                    onError?.(err as unknown as Error);
                    // Lỗi từ backend đã được axios lo việc toast, không cần message.error ở đây
                }
            });
        },
    };

    if (!user) return null;

    // Biến tổng hợp trạng thái Loading (Cả lúc up ảnh lẫn lúc bấm lưu form)
    const isGlobalPending = isUpdatingProfile || isUploadingImage;

    // 4. RENDER UI
    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="w-full">
            {/* --- KHU VỰC AVATAR --- */}
            <div className="flex flex-col items-center mb-10 gap-3">
                <Upload {...uploadProps} disabled={isGlobalPending}>
                    {/* Thẻ div bọc ngoài tạo hiệu ứng hover mờ */}
                    <div className="relative cursor-pointer group rounded-full overflow-hidden border-2 border-transparent transition-colors hover:border-blue-400">
                        <Avatar
                            size={100}
                            src={currentAvatar}
                            icon={!currentAvatar && <UserOutlined />}
                            style={{ background: colorPrimaryBg, color: colorPrimary }}
                        />

                        {/* Lớp phủ đen trong suốt hiện lên khi hover (hoặc đang loading) */}
                        <div className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center transition-opacity ${isUploadingImage ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            {isUploadingImage ? (
                                <LoadingOutlined className="text-white text-xl" />
                            ) : (
                                <>
                                    <CameraOutlined className="text-white text-xl mb-1" />
                                    <span className="text-white text-[11px] font-medium leading-none">Cập nhật</span>
                                </>
                            )}
                        </div>
                    </div>
                </Upload>
                <span className="text-xs text-slate-500">Định dạng JPEG, PNG, GIF. Tối đa 50MB.</span>
            </div>

            {/* --- CÁC TRƯỜNG NHẬP LIỆU --- */}
            <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                    <Form.Item label="Địa chỉ Email">
                        <Input value={user.email} disabled />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Form.Item
                                label="Họ và tên"
                                required
                                validateStatus={fieldState.invalid ? 'error' : ''}
                                help={fieldState.error?.message}
                            >
                                <Input {...field} placeholder="Nhập họ và tên..." disabled={isGlobalPending} />
                            </Form.Item>
                        )}
                    />
                </Col>

                <Col xs={24} md={12}>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Form.Item
                                label="Số điện thoại"
                                required
                                validateStatus={fieldState.invalid ? 'error' : ''}
                                help={fieldState.error?.message}
                            >
                                <Input {...field} placeholder="09xx..." disabled={isGlobalPending} />
                            </Form.Item>
                        )}
                    />
                </Col>

                <Col xs={24} md={12}>
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Form.Item
                                label="Giới tính"
                                required
                                validateStatus={fieldState.invalid ? 'error' : ''}
                                help={fieldState.error?.message}
                            >
                                <Select {...field} options={GENDER_OPTIONS} placeholder="Chọn giới tính" disabled={isGlobalPending} />
                            </Form.Item>
                        )}
                    />
                </Col>

                <Col xs={24}>
                    <Controller
                        name="address"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Form.Item
                                label="Địa chỉ liên hệ"
                                validateStatus={fieldState.invalid ? 'error' : ''}
                                help={fieldState.error?.message}
                                className="mb-8"
                            >
                                <Input {...field} placeholder="Nhập địa chỉ của bạn..." disabled={isGlobalPending} />
                            </Form.Item>
                        )}
                    />
                </Col>
            </Row>

            <div className="flex justify-end gap-3">
                {isDirty && !isGlobalPending && (
                    <Button onClick={() => reset()}>
                        Hoàn tác
                    </Button>
                )}
                <Button type="primary" htmlType="submit" loading={isGlobalPending} disabled={!isDirty}>
                    Lưu thay đổi
                </Button>
            </div>
        </Form>
    );
}