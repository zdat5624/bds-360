package vn.bds360.backend.modules.statistic.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.modules.transaction.constant.TransactionStatus;

@Getter
@Setter
@Builder
public class ManageTransactionStatisticsResponse {

    private KpiSummary kpis;
    private List<CashFlowTrend> cashFlowTrend;
    private List<TransactionStatusStats> statusBreakdown;
    private List<TopSpender> topSpenders;
    private List<TransactionLogDto> recentDeposits;
    private List<TransactionLogDto> topSpendingLogs;

    @Getter
    @Setter
    @Builder
    public static class KpiSummary {
        private long totalCashIn;
        private double cashInGrowthPercent;
        private long totalServiceUsage;
        private double serviceUsageGrowthPercent;
        private long totalLiabilities;
        private double failedDepositRate;
    }

    public interface CashFlowTrend {
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate getDate();

        Long getCashIn();

        Long getCashOut();
    }

    public interface TransactionStatusStats {
        TransactionStatus getStatus();

        Long getCount();
    }

    public interface TopSpender {
        Long getUserId();

        String getName();

        String getEmail();

        String getAvatar();

        Long getTotalSpent();
    }

    @Getter
    @Setter
    @Builder
    public static class TransactionLogDto {
        private String txnId;
        private String userName;
        private String userEmail;
        private String userAvatar;
        private Long amount;
        private TransactionStatus status;
        private String description;
        private Instant createdAt;
    }
}