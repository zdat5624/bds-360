package vn.bds360.backend.modules.transaction.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.bds360.backend.modules.statistic.dto.response.DailyStatProjection;
import vn.bds360.backend.modules.statistic.dto.response.ManageTransactionStatisticsResponse;
import vn.bds360.backend.modules.transaction.constant.TransactionStatus;
import vn.bds360.backend.modules.transaction.constant.TransactionType;
import vn.bds360.backend.modules.transaction.entity.Transaction;
import vn.bds360.backend.modules.user.entity.User;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

        // 1. Hàm dùng riêng cho VNPAY Callback / IPN
        Optional<Transaction> findByTxnId(String txnId);

        // 2. Hàm dùng cho Scheduler (Chạy ngầm dọn dẹp giao dịch rác)
        @Modifying
        @Transactional
        @Query("UPDATE Transaction t SET t.status = 'FAILED', t.description = 'Giao dịch hết hạn: người dùng không hoàn thành' WHERE t.status = 'PENDING' AND t.createdAt <= :expiryTime")
        int updateExpiredTransactions(Instant expiryTime);

        // 3. Nhóm hàm Thống kê / Báo cáo (Dashboard)

        @Query("SELECT SUM(t.amount) FROM Transaction t WHERE YEAR(t.createdAt) = :year AND t.status = :status AND t.amount > 0")
        Long sumAmountByYearAndStatus(Integer year, TransactionStatus status);

        @Query("SELECT SUM(t.amount) FROM Transaction t WHERE YEAR(t.createdAt) = :year AND MONTH(t.createdAt) = :month AND t.status = :status AND t.amount > 0")
        Long sumAmountByYearMonthAndStatus(Integer year, Integer month, TransactionStatus status);

        // Tính tổng tiền theo loại giao dịch từ một thời điểm nhất định (ví dụ: đầu
        // tháng)
        @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = :type AND t.status = :status AND t.createdAt >= :since")
        Long sumAmountByUserAndTypeAndStatusSince(User user, TransactionType type, TransactionStatus status,
                        Instant since);

        // Lấy tất cả giao dịch thành công từ một thời điểm để vẽ biểu đồ
        List<Transaction> findByUserAndStatusAndCreatedAtGreaterThanEqual(User user, TransactionStatus status,
                        Instant createdAt);

        // Đếm tổng tiền giao dịch theo loại, trạng thái và thời gian
        @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.type = :type AND t.status = :status AND t.createdAt BETWEEN :start AND :end")
        Long sumAmountByTypeAndStatusAndDateBetween(
                        @Param("type") TransactionType type,
                        @Param("status") TransactionStatus status,
                        @Param("start") Instant start,
                        @Param("end") Instant end);

        // Đếm số lượng giao dịch theo loại, trạng thái và thời gian (Dùng để tính tỷ lệ
        // lỗi)
        long countByTypeAndStatusAndCreatedAtBetween(TransactionType type, TransactionStatus status, Instant start,
                        Instant end);

        long countByTypeAndCreatedAtBetween(TransactionType type, Instant start, Instant end);

        // Biểu đồ Tương quan Nạp - Tiêu (Dùng ABS cho cashOut)
        @Query(value = "SELECT DATE(created_at) as date, " +
                        "SUM(CASE WHEN type = 'DEPOSIT' AND status = 'SUCCESS' THEN amount ELSE 0 END) as cashIn, " +
                        "SUM(CASE WHEN type = 'PAYMENT' AND status = 'SUCCESS' THEN ABS(amount) ELSE 0 END) as cashOut "
                        +
                        "FROM transactions " +
                        "WHERE created_at BETWEEN :startDate AND :endDate " +
                        "GROUP BY DATE(created_at) ORDER BY date ASC", nativeQuery = true)
        List<ManageTransactionStatisticsResponse.CashFlowTrend> getCashFlowTrend(
                        @Param("startDate") Instant startDate,
                        @Param("endDate") Instant endDate);

        // Biểu đồ Trạng thái giao dịch
        @Query("SELECT t.status as status, COUNT(t.id) as count FROM Transaction t WHERE t.createdAt BETWEEN :start AND :end GROUP BY t.status")
        List<ManageTransactionStatisticsResponse.TransactionStatusStats> getTransactionStatusBreakdown(
                        @Param("start") Instant start,
                        @Param("end") Instant end);

        @Query("SELECT u.id as userId, u.name as name, u.email as email, u.avatar as avatar, SUM(ABS(t.amount)) as totalSpent "
                        +
                        "FROM Transaction t JOIN t.user u " +
                        "WHERE t.type = 'PAYMENT' AND t.status = 'SUCCESS' AND t.createdAt BETWEEN :start AND :end " +
                        "GROUP BY u.id, u.name, u.email, u.avatar " +
                        "ORDER BY totalSpent DESC")
        List<ManageTransactionStatisticsResponse.TopSpender> getTopSpenders(
                        @Param("start") Instant start,
                        @Param("end") Instant end,
                        Pageable pageable);

        // Danh sách nạp tiền gần nhất
        // Lấy 5 giao dịch mới nhất theo Loại và Trạng thái
        List<Transaction> findTop5ByTypeAndStatusOrderByCreatedAtDesc(TransactionType type, TransactionStatus status);

        // Danh sách chi tiêu cao nhất trong kỳ
        List<Transaction> findTop5ByTypeAndStatusAndCreatedAtBetweenOrderByAmountAsc(
                        TransactionType type,
                        TransactionStatus status,
                        Instant start,
                        Instant end);

        // Tính tổng doanh thu (sử dụng ABS vì PAYMENT lưu số âm)
        @Query("SELECT SUM(ABS(t.amount)) FROM Transaction t WHERE t.type = 'PAYMENT' AND t.status = 'SUCCESS' AND t.createdAt BETWEEN :start AND :end")
        Long sumRevenueBetween(@Param("start") Instant start, @Param("end") Instant end);

        // Lấy doanh thu theo từng ngày
        @Query(value = "SELECT CAST(DATE(created_at) AS CHAR) as date, SUM(ABS(amount)) as value " +
                        "FROM transactions " +
                        "WHERE type = 'PAYMENT' AND status = 'SUCCESS' AND created_at BETWEEN :start AND :end " +
                        "GROUP BY CAST(DATE(created_at) AS CHAR) " +
                        "ORDER BY CAST(DATE(created_at) AS CHAR) ASC", nativeQuery = true)
        List<DailyStatProjection> getDailyRevenue(@Param("start") Instant start, @Param("end") Instant end);

        // Đếm giao dịch nạp tiền đang chờ hoặc lỗi
        @Query("SELECT COUNT(t.id) FROM Transaction t WHERE t.type = 'DEPOSIT' AND t.status IN ('PENDING', 'FAILED')")
        long countPendingOrFailedDeposits();
}