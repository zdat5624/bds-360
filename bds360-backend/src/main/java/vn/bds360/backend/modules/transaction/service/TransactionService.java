package vn.bds360.backend.modules.transaction.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.constant.Role;
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

@Service
@RequiredArgsConstructor
public class TransactionService {

        private final TransactionRepository transactionRepository;
        private final TransactionMapper transactionMapper;

        public TransactionResponse getTransactionById(Long id, User currentUser) {
                Transaction transaction = transactionRepository.findById(id)
                                .orElseThrow(() -> new AppException(ErrorCode.TRANSACTION_NOT_FOUND));

                // Kiểm tra: Nếu không phải Admin VÀ không phải chủ sở hữu thì chặn
                boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
                boolean isOwner = transaction.getUser().getId().equals(currentUser.getId());

                if (!isAdmin && !isOwner) {
                        throw new AppException(ErrorCode.FORBIDDEN);
                }

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
        public PageResponse<TransactionResponse> getCurrentUserTransactions(User user,
                        TransactionFilterRequest filter) {

                Sort sort = Sort.by(filter.getSortDirection(), filter.getSortBy());
                Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);

                Page<Transaction> page = transactionRepository.findAll(
                                TransactionSpecification.filterTransactions(filter, user.getId()),
                                pageable);

                return PageResponse.of(page.map(transactionMapper::toTransactionResponse));
        }
}