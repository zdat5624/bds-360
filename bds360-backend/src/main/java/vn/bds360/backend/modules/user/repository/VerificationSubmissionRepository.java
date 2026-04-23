// --- File: user/repository/VerificationSubmissionRepository.java ---
package vn.bds360.backend.modules.user.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.bds360.backend.modules.user.constant.VerificationStatus;
import vn.bds360.backend.modules.user.entity.VerificationSubmission; // 🌟 Đổi import

public interface VerificationSubmissionRepository extends // 🌟 Đổi tên interface
                JpaRepository<VerificationSubmission, Long>, // 🌟 Đổi Entity type
                JpaSpecificationExecutor<VerificationSubmission> {

        boolean existsByUserIdAndStatus(Long userId, VerificationStatus status);

        Optional<VerificationSubmission> findTopByUserIdOrderByCreatedAtDesc(Long userId);

        Page<VerificationSubmission> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

        Optional<VerificationSubmission> findTopByUserIdAndStatusOrderByCreatedAtDesc(Long userId,
                        VerificationStatus status);

        long countByStatus(VerificationStatus status);
}