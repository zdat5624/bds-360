// @/features/media/api/media.mutations.ts

import customFetch from '@/lib/custom-fetch';
import { useMutation } from '@tanstack/react-query';
import { UploadMediaPayload } from './types';

// Hàm gửi File chung (tài liệu, pdf, v.v...)
const uploadFiles = async ({ files }: UploadMediaPayload): Promise<string[]> => {
    const formData = new FormData();

    // Backend đang hứng: @RequestParam("files") List<MultipartFile> files
    files.forEach((file) => {
        formData.append('files', file);
    });

    return customFetch.post('/media/upload/file', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// Hàm gửi File hình ảnh (có validate chặt chẽ định dạng ở Backend)
const uploadImages = async ({ files }: UploadMediaPayload): Promise<string[]> => {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append('files', file);
    });

    return customFetch.post('/media/upload/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// --- Custom Hooks ---

export const useUploadFiles = () => {
    return useMutation({
        mutationFn: uploadFiles,
        // Không cần dùng queryClient.invalidateQueries() ở đây
        // Vì tính năng này không lưu danh sách quản lý media. 
        // Các ảnh sau khi up thành công sẽ được Component hứng lấy mảng chuỗi URL trả về.
    });
};

export const useUploadImages = () => {
    return useMutation({
        mutationFn: uploadImages,
    });
};