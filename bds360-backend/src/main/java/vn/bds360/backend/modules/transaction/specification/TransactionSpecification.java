package vn.bds360.backend.modules.transaction.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import vn.bds360.backend.common.constant.TransactionFilterType;
import vn.bds360.backend.modules.transaction.dto.request.TransactionFilterRequest;
import vn.bds360.backend.modules.transaction.entity.Transaction;
import vn.bds360.backend.modules.user.entity.User;

public class TransactionSpecification {

    public static Specification<Transaction> filterTransactions(TransactionFilterRequest filter, Long targetUserId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Phân quyền: Lọc theo User đang đăng nhập (Dành cho API My-Transactions)
            if (targetUserId != null) {
                predicates.add(cb.equal(root.get("user").get("id"), targetUserId));
            }

            // 2. Lọc theo Email (Dành cho Admin)
            if (filter.getEmail() != null && !filter.getEmail().trim().isEmpty()) {
                // Tối ưu hóa: Dùng Join để query sang bảng User thay vì get liên tiếp
                Join<Transaction, User> userJoin = root.join("user");
                predicates.add(cb.equal(userJoin.get("email"), filter.getEmail().trim()));
            }

            // 3. Lọc theo ID giao dịch nội bộ
            if (filter.getTransactionId() != null) {
                predicates.add(cb.equal(root.get("id"), filter.getTransactionId()));
            }

            // 4. Lọc theo mã giao dịch VNPAY (txnId)
            if (filter.getTxnId() != null && !filter.getTxnId().trim().isEmpty()) {
                predicates.add(cb.equal(root.get("txnId"), filter.getTxnId().trim()));
            }

            // 5. Lọc theo trạng thái (SUCCESS, PENDING, FAILED)
            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }

            // 6. Lọc theo loại giao dịch (DEPOSIT: nạp tiền, PAYMENT: trừ tiền)
            if (filter.getType() != null && filter.getType() != TransactionFilterType.ALL) {
                if (filter.getType() == TransactionFilterType.DEPOSIT) {
                    predicates.add(cb.greaterThan(root.get("amount"), 0L));
                } else if (filter.getType() == TransactionFilterType.PAYMENT) {
                    predicates.add(cb.lessThan(root.get("amount"), 0L));
                }
            }

            // 7. Lọc theo khoảng thời gian tạo giao dịch
            if (filter.getStartDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), filter.getStartDate()));
            }
            if (filter.getEndDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), filter.getEndDate()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}