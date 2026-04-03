package vn.bds360.backend.modules.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.annotation.ApiGlobalResponse;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.modules.auth.dto.request.ChangePasswordRequest;
import vn.bds360.backend.modules.auth.dto.request.ForgotPasswordRequest;
import vn.bds360.backend.modules.auth.dto.request.LoginRequest;
import vn.bds360.backend.modules.auth.dto.request.RegisterRequest;
import vn.bds360.backend.modules.auth.dto.request.ResetPasswordRequest;
import vn.bds360.backend.modules.auth.dto.response.LoginResponse;
import vn.bds360.backend.modules.auth.service.AuthService;
import vn.bds360.backend.modules.auth.service.ForgotPasswordService;
import vn.bds360.backend.modules.user.dto.response.UserResponse;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.service.UserService;
import vn.bds360.backend.security.annotation.CurrentUser;
import vn.bds360.backend.security.annotation.RequireLogin;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@ApiGlobalResponse
@Tag(name = "auth", description = "Xác thực, đăng ký và khôi phục mật khẩu")
public class AuthController {

    private final AuthService authService;
    private final ForgotPasswordService forgotPasswordService;
    private final UserService userService;

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(authService.login(request), "Đăng nhập thành công");
    }

    @GetMapping("/account")
    @ResponseStatus(HttpStatus.OK)
    @RequireLogin
    public ApiResponse<UserResponse> getAccount(@CurrentUser User user) {

        return ApiResponse.success(authService.getAccount(user.getEmail()), "Lấy thông tin tài khoản thành công");
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success(authService.register(request), "Đăng ký tài khoản thành công");
    }

    @PostMapping("/forgot-password")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Void> requestPasswordReset(@Valid @RequestBody ForgotPasswordRequest request) {
        forgotPasswordService.requestPasswordReset(request.getEmail());
        return ApiResponse.success(null, "Mã xác nhận đã được gửi đến email của bạn.");
    }

    @PostMapping("/reset-password")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        forgotPasswordService.resetPassword(request.getEmail(), request.getCode(), request.getNewPassword());
        return ApiResponse.success(null, "Đặt lại mật khẩu thành công.");
    }

    @PostMapping("/change-password")
    @ResponseStatus(HttpStatus.OK)
    @RequireLogin
    public ApiResponse<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request, @CurrentUser User user) {

        userService.changePassword(user.getEmail(), request.getCurrentPassword(), request.getNewPassword());
        return ApiResponse.success(null, "Đổi mật khẩu thành công.");
    }
}