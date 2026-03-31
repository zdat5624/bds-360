package vn.bds360.backend.modules.transaction.repository;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.bds360.backend.common.constant.TransStatusEnum;
import vn.bds360.backend.modules.transaction.entity.Transaction;

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
        Long sumAmountByYearAndStatus(Integer year, TransStatusEnum status);

        @Query("SELECT SUM(t.amount) FROM Transaction t WHERE YEAR(t.createdAt) = :year AND MONTH(t.createdAt) = :month AND t.status = :status AND t.amount > 0")
        Long sumAmountByYearMonthAndStatus(Integer year, Integer month, TransStatusEnum status);
}