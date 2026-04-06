// @/features/media/api/types.ts

export interface UploadMediaPayload {
    // Giao diện Frontend (như Antd Upload) thường thao tác với mảng File gốc của trình duyệt
    files: File[];
}