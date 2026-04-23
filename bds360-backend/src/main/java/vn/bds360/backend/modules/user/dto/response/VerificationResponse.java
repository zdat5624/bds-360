// --- File: user/dto/response/VerificationResponse.java ---
package vn.bds360.backend.modules.user.dto.response;

import java.time.Instant;

import lombok.Data;
import vn.bds360.backend.modules.user.constant.VerificationStatus;

@Data
public class VerificationResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String idCardFront;
    private String idCardBack;
    private VerificationStatus status;
    private String reviewNote;
    private Instant createdAt;
    private Instant reviewedAt;
    private String reviewedBy;
    private String userAvatar;

}