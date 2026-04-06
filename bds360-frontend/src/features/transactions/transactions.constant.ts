// @/features/transactions/transactions.constant.ts

export const TRANSACTION_STATUS_OPTIONS = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
} as const;

export type TransactionStatus = keyof typeof TRANSACTION_STATUS_OPTIONS;

export const TRANSACTION_FILTER_TYPE_OPTIONS = {
    DEPOSIT: 'DEPOSIT',
    PAYMENT: 'PAYMENT',
    ALL: 'ALL',
} as const;

export type TransactionFilterType = keyof typeof TRANSACTION_FILTER_TYPE_OPTIONS;