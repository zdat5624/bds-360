// @/features/transactions/api/types.ts

import { BaseFilterParams } from '@/types';
import { TransactionStatus, TransactionType } from '../transactions.constant';

export interface TransactionUser {
    id: number;
    name: string;
    email: string;
}

export interface Transaction {
    id: number;
    amount: number;
    status: TransactionStatus;
    paymentLink?: string;
    txnId?: string;
    type: TransactionType; // BỔ SUNG: Khớp với TransactionResponse.java
    description?: string;
    createdAt: string;
    updatedAt?: string;
    user: TransactionUser;
}

export interface PaymentLink {
    paymentLink: string;
}

export interface CreatePaymentPayload {
    amount: number;
}

export interface TransactionFilterParams extends BaseFilterParams {
    email?: string;
    transactionId?: number;
    txnId?: string;
    status?: TransactionStatus;
    type?: TransactionType;
    startDate?: string;
    endDate?: string;
}