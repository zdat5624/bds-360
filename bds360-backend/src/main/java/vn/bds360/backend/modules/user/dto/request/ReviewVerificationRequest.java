// --- File: user/dto/request/ReviewVerificationRequest.java ---
package vn.bds360.backend.modules.user.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.modules.user.constant.VerificationStatus;

@Getter
@Setter
public class ReviewVerificationRequest {
    @NotNull(message = "Trạng thái duyệt không được để trống")
    private VerificationStatus status; // Truyền VERIFIED hoặc REJECTED

    private String note; // Lý do từ chối (bắt buộc nếu status là REJECTED)
}