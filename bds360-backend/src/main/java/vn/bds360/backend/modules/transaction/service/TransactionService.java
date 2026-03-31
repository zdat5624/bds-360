package vn.bds360.backend.modules.transaction.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.dto.response.PageResponse;
import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.modules.transaction.dto.request.TransactionFilterRequest;
import vn.bds360.backend.modules.transaction.dto.response.TransactionResponse;
import vn.bds360.backend.modules.transaction.entity.Transaction;
import vn.bds360.backend.modules.transaction.mapper.TransactionMapper;
import vn.bds360.backend.modules.transaction.repository.TransactionRepository;
import vn.bds360.backend.modules.transaction.specification.TransactionSpecification;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.repository.UserRepository;
import vn.bds360.backend.security.SecurityUtil;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final TransactionMapper transactionMapper;

    public TransactionResponse getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TRANSACTION_NOT_FOUND));
        return transactionMapper.toTransactionResponse(transaction);
    }

    // ==========================================
    // Dành cho ADMIN
    // ==========================================
    public PageResponse<TransactionResponse> getTransactions(TransactionFilterRequest filter) {

        Sort sort = Sort.by(filter.getSortDirection(), filter.getSortBy());
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);

        // Truyền null cho targetUserId để lấy toàn bộ giao dịch
        Page<Transaction> page = transactionRepository.findAll(
                TransactionSpecification.filterTransactions(filter, null),
                pageable);

        return PageResponse.of(page.map(transactionMapper::toTransactionResponse));
    }

    // ==========================================
    // Dành cho USER (Chỉ lấy giao dịch của chính họ)
    // ==========================================
    public PageResponse<TransactionResponse> getCurrentUserTransactions(TransactionFilterRequest filter) {

        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Sort sort = Sort.by(filter.getSortDirection(), filter.getSortBy());
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);

        // Truyền user.getId() vào để Specification ép buộc lọc theo ID này
        Page<Transaction> page = transactionRepository.findAll(
                TransactionSpecification.filterTransactions(filter, user.getId()),
                pageable);

        return PageResponse.of(page.map(transactionMapper::toTransactionResponse));
    }
}