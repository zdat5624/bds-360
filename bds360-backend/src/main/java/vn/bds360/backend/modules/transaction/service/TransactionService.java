package vn.bds360.backend.modules.transaction.service;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import vn.bds360.backend.common.constant.TransStatusEnum;
import vn.bds360.backend.common.constant.TransactionFilterType;
import vn.bds360.backend.common.exception.NotFoundException;
import vn.bds360.backend.modules.transaction.entity.Transaction;
import vn.bds360.backend.modules.transaction.repository.TransactionRepository;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.repository.UserRepository;
import vn.bds360.backend.security.SecurityUtil;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy giao dịch id: " + id));
    }

    public Page<Transaction> getTransactions(
            Pageable pageable, String email, Long transactionId, String txnId,
            TransStatusEnum status, TransactionFilterType type, Instant startDate, Instant endDate) {
        String typeStr = type != null ? type.name() : null;
        return transactionRepository.findTransactionsWithFilters(
                email, transactionId, txnId, status, typeStr, startDate, endDate, pageable);
    }

    public Page<Transaction> getUserTransactions(Long userId, Pageable pageable) {
        return transactionRepository.findByUserId(userId, pageable);
    }

    public Page<Transaction> getCurrentUserTransactions(Pageable pageable, TransactionFilterType type,
            TransStatusEnum status) {
        Optional<String> currentUserLogin = SecurityUtil.getCurrentUserLogin();
        if (currentUserLogin.isEmpty()) {
            throw new IllegalStateException("User not authenticated");
        }

        Optional<User> user = userRepository.findByEmail(currentUserLogin.get());
        if (user.isEmpty()) {
            throw new IllegalStateException("User not found");
        }

        switch (type) {
            case DEPOSIT:
                return transactionRepository.findByUserIdAndAmountGreaterThanAndStatus(user.get().getId(), 0, status,
                        pageable);
            case PAYMENT:
                return transactionRepository.findByUserIdAndAmountLessThanAndStatus(user.get().getId(), 0, status,
                        pageable);
            case ALL:
            default:
                return transactionRepository.findByUserIdAndStatus(user.get().getId(), status, pageable);
        }
    }
}
