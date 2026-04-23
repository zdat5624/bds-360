package vn.bds360.backend.modules.statistic.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.bds360.backend.modules.statistic.dto.response.ManageTransactionStatisticsResponse;
import vn.bds360.backend.modules.statistic.dto.response.ManageTransactionStatisticsResponse.KpiSummary;
import vn.bds360.backend.modules.statistic.dto.response.ManageTransactionStatisticsResponse.TransactionLogDto;
import vn.bds360.backend.modules.transaction.constant.TransactionStatus;
import vn.bds360.backend.modules.transaction.constant.TransactionType;
import vn.bds360.backend.modules.transaction.entity.Transaction;
import vn.bds360.backend.modules.transaction.repository.TransactionRepository;
import vn.bds360.backend.modules.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class ManageTransactionStatisticsService {

        private final TransactionRepository transactionRepository;
        private final UserRepository userRepository;

        @Transactional(readOnly = true)
        public ManageTransactionStatisticsResponse getTransactionDashboard(int days) {
                Instant endDate = Instant.now();
                Instant startDate = endDate.minus(days, ChronoUnit.DAYS);

                Instant prevEndDate = startDate;
                Instant prevStartDate = prevEndDate.minus(days, ChronoUnit.DAYS);

                // 1. KPI: Tong tien nap (Cash In)
                Long cashInObj = transactionRepository.sumAmountByTypeAndStatusAndDateBetween(TransactionType.DEPOSIT,
                                TransactionStatus.SUCCESS, startDate, endDate);
                long cashIn = cashInObj != null ? cashInObj : 0L;

                Long prevCashInObj = transactionRepository.sumAmountByTypeAndStatusAndDateBetween(
                                TransactionType.DEPOSIT,
                                TransactionStatus.SUCCESS, prevStartDate, prevEndDate);
                long prevCashIn = prevCashInObj != null ? prevCashInObj : 0L;
                double cashInGrowth = calculateGrowth(cashIn, prevCashIn);

                // 2. KPI: Tong tieu dung (Service Usage) - Su dung Math.abs() de tinh tong the
                // tich
                Long serviceUsageObj = transactionRepository.sumAmountByTypeAndStatusAndDateBetween(
                                TransactionType.PAYMENT,
                                TransactionStatus.SUCCESS, startDate, endDate);
                long serviceUsage = serviceUsageObj != null ? Math.abs(serviceUsageObj) : 0L;

                Long prevServiceUsageObj = transactionRepository.sumAmountByTypeAndStatusAndDateBetween(
                                TransactionType.PAYMENT,
                                TransactionStatus.SUCCESS, prevStartDate, prevEndDate);
                long prevServiceUsage = prevServiceUsageObj != null ? Math.abs(prevServiceUsageObj) : 0L;
                double serviceUsageGrowth = calculateGrowth(serviceUsage, prevServiceUsage);

                // 3. KPI: Tong du no he thong
                Long liabilitiesObj = userRepository.sumTotalSystemBalance();
                long liabilities = liabilitiesObj != null ? liabilitiesObj : 0L;

                // 4. KPI: Ty le nap loi
                long totalDeposits = transactionRepository.countByTypeAndCreatedAtBetween(TransactionType.DEPOSIT,
                                startDate,
                                endDate);
                long failedDeposits = transactionRepository.countByTypeAndStatusAndCreatedAtBetween(
                                TransactionType.DEPOSIT,
                                TransactionStatus.FAILED, startDate, endDate);
                double failedDepositRate = totalDeposits > 0 ? ((double) failedDeposits / totalDeposits) * 100 : 0.0;

                KpiSummary kpis = KpiSummary.builder()
                                .totalCashIn(cashIn)
                                .cashInGrowthPercent(Math.round(cashInGrowth * 10.0) / 10.0)
                                .totalServiceUsage(serviceUsage)
                                .serviceUsageGrowthPercent(Math.round(serviceUsageGrowth * 10.0) / 10.0)
                                .totalLiabilities(liabilities)
                                .failedDepositRate(Math.round(failedDepositRate * 10.0) / 10.0)
                                .build();

                // 5. Bang du lieu Read-only
                List<Transaction> recentDepositEntities = transactionRepository
                                .findTop5ByTypeAndStatusOrderByCreatedAtDesc(
                                                TransactionType.DEPOSIT,
                                                TransactionStatus.SUCCESS);
                // Su dung Asc vi so am cang nho thi chi tieu cang lon
                List<Transaction> topSpendingEntities = transactionRepository
                                .findTop5ByTypeAndStatusAndCreatedAtBetweenOrderByAmountAsc(
                                                TransactionType.PAYMENT, TransactionStatus.SUCCESS, startDate, endDate);

                return ManageTransactionStatisticsResponse.builder()
                                .kpis(kpis)
                                .cashFlowTrend(transactionRepository.getCashFlowTrend(startDate, endDate))
                                .statusBreakdown(
                                                transactionRepository.getTransactionStatusBreakdown(startDate, endDate))
                                .topSpenders(transactionRepository.getTopSpenders(startDate, endDate,
                                                PageRequest.of(0, 10)))
                                .recentDeposits(mapToLogDto(recentDepositEntities))
                                .topSpendingLogs(mapToLogDto(topSpendingEntities))
                                .build();
        }

        private double calculateGrowth(long current, long previous) {
                if (previous > 0) {
                        return ((double) (current - previous) / previous) * 100;
                } else if (current > 0) {
                        return 100.0;
                }
                return 0.0;
        }

        private List<TransactionLogDto> mapToLogDto(List<Transaction> transactions) {
                return transactions.stream().map(t -> TransactionLogDto.builder()
                                .txnId(t.getTxnId())
                                .userName(t.getUser().getName())
                                .userEmail(t.getUser().getEmail())
                                .userAvatar(t.getUser().getAvatar())
                                .amount(Math.abs(t.getAmount()))
                                .status(t.getStatus())
                                .description(t.getDescription())
                                .createdAt(t.getCreatedAt())
                                .build()).collect(Collectors.toList());
        }
}