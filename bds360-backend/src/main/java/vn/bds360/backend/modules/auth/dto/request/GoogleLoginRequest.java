// auth/dto/request/GoogleLoginRequest.java
package vn.bds360.backend.modules.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoogleLoginRequest {
    @NotBlank(message = "Token không được để trống")
    private String token;
}