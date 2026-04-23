// @/features/statistics/api/manage-transaction-statistics.types.ts

import { TransactionStatus } from "@/features/transactions";

// Enum cục bộ cho trạng thái giao dịch

export interface ManageTransactionStatisticsResponse {
    kpis: TransactionKpiSummary;
    cashFlowTrend: CashFlowTrend[];
    statusBreakdown: TransactionStatusStats[];
    topSpenders: TopSpender[];
    recentDeposits: TransactionLogDto[];
    topSpendingLogs: TransactionLogDto[];
}

export interface TransactionKpiSummary {
    totalCashIn: number;
    cashInGrowthPercent: number;
    totalServiceUsage: number;
    serviceUsageGrowthPercent: number;
    totalLiabilities: number;
    failedDepositRate: number;
}

export interface CashFlowTrend {
    date: string; // Format: YYYY-MM-DD
    cashIn: number;
    cashOut: number;
}

export interface TransactionStatusStats {
    status: TransactionStatus;
    count: number;
}

export interface TopSpender {
    userId: number;
    name: string;
    email: string;
    avatar: string;
    totalSpent: number;
}

export interface TransactionLogDto {
    txnId: string;
    userName: string;
    userEmail: string;
    userAvatar: string;
    amount: number;
    status: TransactionStatus;
    description: string;
    createdAt: string; // ISO String
}