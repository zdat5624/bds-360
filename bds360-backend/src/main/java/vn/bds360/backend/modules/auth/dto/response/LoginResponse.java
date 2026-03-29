package vn.bds360.backend.modules.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.modules.user.dto.response.UserResponse;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {
    private String accessToken;
    private UserResponse user;
}