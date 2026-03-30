package vn.bds360.backend.modules.user.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.bds360.backend.modules.user.dto.request.UserFilterRequest;
import vn.bds360.backend.modules.user.entity.User;

public class UserSpecification {

    public static Specification<User> filterUsers(UserFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Lọc theo Tên (Tìm kiếm tương đối - LIKE)
            if (filter.getName() != null && !filter.getName().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + filter.getName().trim().toLowerCase() + "%"));
            }

            // 2. Lọc theo Email (Tìm kiếm tương đối - LIKE)
            if (filter.getEmail() != null && !filter.getEmail().trim().isEmpty()) {
                predicates
                        .add(cb.like(cb.lower(root.get("email")), "%" + filter.getEmail().trim().toLowerCase() + "%"));
            }

            // 3. Lọc theo Số điện thoại (LIKE)
            if (filter.getPhone() != null && !filter.getPhone().trim().isEmpty()) {
                predicates.add(cb.like(root.get("phone"), "%" + filter.getPhone().trim() + "%"));
            }

            // 4. Lọc theo Địa chỉ (LIKE)
            if (filter.getAddress() != null && !filter.getAddress().trim().isEmpty()) {
                predicates.add(
                        cb.like(cb.lower(root.get("address")), "%" + filter.getAddress().trim().toLowerCase() + "%"));
            }

            // 5. Lọc theo Vai trò (Chính xác - EQUAL)
            if (filter.getRole() != null) {
                predicates.add(cb.equal(root.get("role"), filter.getRole()));
            }

            // 6. Lọc theo Giới tính (Chính xác - EQUAL)
            if (filter.getGender() != null) {
                predicates.add(cb.equal(root.get("gender"), filter.getGender()));
            }

            // 7. Lọc theo khoảng Số dư (Từ - Đến)
            if (filter.getMinBalance() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("balance"), filter.getMinBalance()));
            }
            if (filter.getMaxBalance() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("balance"), filter.getMaxBalance()));
            }

            // 8. Lọc theo khoảng Thời gian tạo (Từ ngày - Đến ngày)
            if (filter.getCreatedFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), filter.getCreatedFrom()));
            }
            if (filter.getCreatedTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), filter.getCreatedTo()));
            }

            // Gộp tất cả các điều kiện lại bằng toán tử AND
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}