// --- File: user/entity/VerificationSubmission.java ---
package vn.bds360.backend.modules.user.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.bds360.backend.modules.user.constant.VerificationStatus;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "verification_submissions")
public class VerificationSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String idCardFront;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String idCardBack;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus status;

    private String reviewNote; // Lý do từ chối

    private Instant createdAt;
    private Instant reviewedAt;
    private String reviewedBy; // Lưu email của Admin/Mod đã duyệt đơn này

    @PrePersist
    public void prePersist() {
        // Chỉ gán ngày hiện tại nếu chưa được set (Hỗ trợ tốt cho việc Seed dữ liệu quá
        // khứ)
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }

        // Chỉ gán trạng thái PENDING nếu chưa được set (Hỗ trợ Seeder tạo dữ liệu
        // APPROVED/REJECTED)
        if (this.status == null) {
            this.status = VerificationStatus.PENDING;
        }
    }
}