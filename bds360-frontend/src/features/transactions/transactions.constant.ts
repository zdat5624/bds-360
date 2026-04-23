// @/features/transactions/transactions.constant.ts

import type { PresetStatusColorType } from 'antd/es/_util/colors';
// ==========================================
// 1. TRẠNG THÁI GIAO DỊCH (STATUS)
// ==========================================
export const TRANSACTION_STATUS_VALUES = ['PENDING', 'SUCCESS', 'FAILED'] as const;

export type TransactionStatus = (typeof TRANSACTION_STATUS_VALUES)[number];

// Từ điển Map sang tiếng Việt
export const TRANSACTION_STATUS_LABEL: Record<TransactionStatus, string> = {
    PENDING: 'Đang thanh toán',
    SUCCESS: 'Thành công',
    FAILED: 'Thất bại',
};

// Mảng Options build sẵn cho <Select>, <Radio> của Antd
export const TRANSACTION_STATUS_OPTIONS = TRANSACTION_STATUS_VALUES.map((value) => ({
    value,
    label: TRANSACTION_STATUS_LABEL[value],
}));


// ==========================================
// 2. LOẠI GIAO DỊCH (TYPE)
// ==========================================
export const TRANSACTION_TYPE_VALUES = ['DEPOSIT', 'PAYMENT'] as const;

export type TransactionType = (typeof TRANSACTION_TYPE_VALUES)[number];

// Từ điển Map sang tiếng Việt
export const TRANSACTION_TYPE_LABEL: Record<TransactionType, string> = {
    DEPOSIT: 'Nạp tiền',
    PAYMENT: 'Thanh toán',
};

// Mảng Options build sẵn cho <Select>, <Radio> của Antd
export const TRANSACTION_TYPE_OPTIONS = TRANSACTION_TYPE_VALUES.map((value) => ({
    value,
    label: TRANSACTION_TYPE_LABEL[value],
}));

export const TRANSACTION_STATUS_COLOR: Record<TransactionStatus, PresetStatusColorType> = {
    SUCCESS: 'success',
    PENDING: 'warning',
    FAILED: 'error',
};