// @/features/users/components/user-form.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { GENDER_OPTIONS, USER_ROLE_OPTIONS_NO_ADMIN } from '@/constants';
import { useUploadImages } from '@/features/media';
import { User } from '@/types/models.types';
import { getErrorMessage } from '@/utils';
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Form, Input, Select, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';
import { Controller, Resolver, SubmitHandler, useForm } from 'react-hook-form';
import { useCreateUser, useUpdateUser } from '../api/user.mutations';
import {
    CreateUserFormValues,
    createUserSchema,
    UpdateUserFormValues,
    updateUserSchema,
} from '../users.schema';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}
type FormValues = CreateUserFormValues & Partial<UpdateUserFormValues>;

export function UserFormModal({ isOpen, onClose, user }: UserFormModalProps) {
    const { message } = App.useApp();
    const isEdit = !!user;

    const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();
    const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
    const { mutateAsync: uploadImages } = useUploadImages();

    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);

    const isLoading = isCreating || isUpdating || isUploading;

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema) as unknown as Resolver<FormValues>,
        defaultValues: {
            name: '',
            email: '',
            password: '',
            phone: '',
            role: 'USER',
            gender: 'OTHER',
            address: '',
            avatar: '',
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (isEdit && user) {
                setAvatarUrl(user.avatar || '');
                reset({
                    id: user.id,
                    name: user.name,
                    phone: user.phone,
                    role: user.role,
                    gender: user.gender,
                    address: user.address || '',
                    avatar: user.avatar || '',
                });
            } else {
                setAvatarUrl('');
                reset({
                    name: '',
                    email: '',
                    password: '',
                    phone: '',
                    role: 'USER',
                    gender: 'OTHER',
                    address: '',
                    avatar: '',
                });
            }
        }
    }, [isOpen, user, reset, isEdit]);

    const handleUploadChange: UploadProps['onChange'] = async (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setIsUploading(true);
            return;
        }
        if (info.file.status === 'done' && info.file.originFileObj) {
            try {
                const urls = await uploadImages({ files: [info.file.originFileObj as File] });
                if (urls && urls.length > 0) {
                    const newAvatarUrl = urls[0];
                    setAvatarUrl(newAvatarUrl);
                    setValue('avatar', newAvatarUrl, { shouldValidate: true });
                    message.success('Tải ảnh lên thành công');
                }
            } catch {
                message.error('Lỗi khi tải ảnh lên');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPngOrWebp = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
        if (!isJpgOrPngOrWebp) {
            message.error('Bạn chỉ có thể tải lên tệp JPG/PNG/WEBP!');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Kích thước ảnh không được vượt quá 5MB!');
        }
        return isJpgOrPngOrWebp && isLt5M;
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            if (isEdit && user) {
                await updateUser(data as UpdateUserFormValues);
                message.success('Cập nhật người dùng thành công');
            } else {
                await createUser(data as CreateUserFormValues);
                message.success('Tạo người dùng mới thành công');
            }
            onClose();
        } catch (error) {
            const err = getErrorMessage(error);
            message.error(err);
        }
    };

    const uploadButton = (
        <div className="flex flex-col items-center justify-center text-gray-500">
            {isUploading ? <LoadingOutlined /> : <CameraOutlined className="text-xl" />}
            <div className="mt-2 text-sm">Tải ảnh lên</div>
        </div>
    );

    return (
        <AppModal
            title={isEdit ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
            isOpen={isOpen}
            onClose={onClose}
            width={600}
            isLoading={isLoading}
        >
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <div className="w-full flex justify-center mb-6">
                    <Form.Item
                        name="avatar"
                        className="!mb-0 text-center"
                        validateStatus={errors.avatar ? 'error' : ''}
                        help={errors.avatar?.message as string}
                    >
                        <div className="flex justify-center">
                            <Upload
                                name="avatar"
                                listType="picture-circle"
                                className="avatar-uploader"
                                showUploadList={false}
                                customRequest={({ onSuccess }) => {
                                    setTimeout(() => {
                                        onSuccess?.("ok");
                                    }, 0);
                                }}
                                beforeUpload={beforeUpload}
                                onChange={handleUploadChange}
                                disabled={isUploading}
                            >
                                {avatarUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={avatarUrl}
                                        alt="avatar"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        </div>
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        label={<span className="font-medium">Tên người dùng</span>}
                        validateStatus={errors.name ? 'error' : ''}
                        help={errors.name?.message as string}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="Nguyễn Văn A" size="large" />}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-medium">Số điện thoại</span>}
                        validateStatus={errors.phone ? 'error' : ''}
                        help={errors.phone?.message as string}
                    >
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="09xxxxxxxxx" size="large" />}
                        />
                    </Form.Item>
                </div>

                {!isEdit && (
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            label={<span className="font-medium">Email</span>}
                            validateStatus={errors.email ? 'error' : ''}
                            help={errors.email?.message as string}
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="example@email.com" size="large" />}
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="font-medium">Mật khẩu</span>}
                            validateStatus={errors.password ? 'error' : ''}
                            help={errors.password?.message as string}
                        >
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => <Input.Password {...field} placeholder="******" size="large" />}
                            />
                        </Form.Item>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        label={<span className="font-medium">Vai trò</span>}
                        validateStatus={errors.role ? 'error' : ''}
                        help={errors.role?.message as string}
                    >
                        <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} options={USER_ROLE_OPTIONS_NO_ADMIN} size="large" />
                            )}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-medium">Giới tính</span>}
                        validateStatus={errors.gender ? 'error' : ''}
                        help={errors.gender?.message as string}
                    >
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} options={GENDER_OPTIONS} size="large" />
                            )}
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    label={<span className="font-medium">Địa chỉ</span>}
                    validateStatus={errors.address ? 'error' : ''}
                    help={errors.address?.message as string}
                >
                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => <Input{...field} placeholder="Nhập địa chỉ" size="large" />}
                    />
                </Form.Item>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                        disabled={isLoading}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                </div>
            </Form>
        </AppModal>
    );
}