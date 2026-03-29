package vn.bds360.backend.modules.auth.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.modules.auth.dto.request.*;
import vn.bds360.backend.modules.auth.dto.response.LoginResponse;
import vn.bds360.backend.modules.auth.service.AuthService;
import vn.bds360.backend.modules.auth.service.ForgotPasswordService;
import vn.bds360.backend.modules.user.dto.response.UserResponse;
import vn.bds360.backend.modules.user.service.UserService;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
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
    public ApiResponse<UserResponse> getAccount(Principal principal) {
        if (principal == null)
            throw new AppException(ErrorCode.UNAUTHORIZED);
        return ApiResponse.success(authService.getAccount(principal.getName()), "Lấy thông tin tài khoản thành công");
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
    public ApiResponse<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request, Principal principal) {
        if (principal == null)
            throw new AppException(ErrorCode.UNAUTHORIZED);
        userService.changePassword(principal.getName(), request.getCurrentPassword(), request.getNewPassword());
        return ApiResponse.success(null, "Đổi mật khẩu thành công.");
    }
}