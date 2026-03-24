package vn.bds360.backend.modules.transaction.repository;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.bds360.backend.common.constant.TransStatusEnum;
import vn.bds360.backend.modules.transaction.entity.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
        @Modifying
        @Transactional
        @Query("UPDATE Transaction t SET t.status = 'FAILED', t.description = 'Giao dịch hết hạn: người dùng không hoàn thành' WHERE t.status = 'PENDING' AND t.createdAt <= :expiryTime")
        int updateExpiredTransactions(Instant expiryTime);

        Optional<Transaction> findByTxnId(String txnId);

        @Query("SELECT t FROM Transaction t JOIN t.user u WHERE "
                        + "(:email IS NULL OR u.email = :email) AND "
                        + "(:transactionId IS NULL OR t.id = :transactionId) AND "
                        + "(:txnId IS NULL OR t.txnId = :txnId) AND "
                        + "(:status IS NULL OR t.status = :status) AND "
                        + "(:startDate IS NULL OR t.createdAt >= :startDate) AND "
                        + "(:endDate IS NULL OR t.createdAt <= :endDate) AND "
                        + "(:type IS NULL OR :type = 'ALL' OR "
                        + "(:type = 'DEPOSIT' AND t.amount > 0) OR "
                        + "(:type = 'PAYMENT' AND t.amount < 0))")
        Page<Transaction> findTransactionsWithFilters(
                        String email,
                        Long transactionId,
                        String txnId,
                        TransStatusEnum status,
                        String type,
                        Instant startDate,
                        Instant endDate,
                        Pageable pageable);

        Page<Transaction> findByUserId(Long userId, Pageable pageable);

        Page<Transaction> findByUserIdAndAmountGreaterThan(Long userId, long amount, Pageable pageable);

        Page<Transaction> findByUserIdAndAmountLessThan(Long userId, long amount, Pageable pageable);

        @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND (:status IS NULL OR t.status = :status)")
        Page<Transaction> findByUserIdAndStatus(Long userId, TransStatusEnum status, Pageable pageable);

        @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.amount > :amount AND (:status IS NULL OR t.status = :status)")
        Page<Transaction> findByUserIdAndAmountGreaterThanAndStatus(Long userId, long amount, TransStatusEnum status,
                        Pageable pageable);

        @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.amount < :amount AND (:status IS NULL OR t.status = :status)")
        Page<Transaction> findByUserIdAndAmountLessThanAndStatus(Long userId, long amount, TransStatusEnum status,
                        Pageable pageable);

        @Query("SELECT SUM(t.amount) FROM Transaction t WHERE YEAR(t.createdAt) = :year AND t.status = :status AND t.amount > 0")
        Long sumAmountByYearAndStatus(Integer year, TransStatusEnum status);

        @Query("SELECT SUM(t.amount) FROM Transaction t WHERE YEAR(t.createdAt) = :year AND MONTH(t.createdAt) = :month AND t.status = :status AND t.amount > 0")
        Long sumAmountByYearMonthAndStatus(Integer year, Integer month, TransStatusEnum status);
}