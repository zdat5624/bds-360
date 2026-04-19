package vn.bds360.backend.modules.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmitVerificationRequest {
    @NotBlank(message = "Vui lòng cung cấp ảnh mặt trước CCCD/CMND")
    private String idCardFront;

    @NotBlank(message = "Vui lòng cung cấp ảnh mặt sau CCCD/CMND")
    private String idCardBack;
}