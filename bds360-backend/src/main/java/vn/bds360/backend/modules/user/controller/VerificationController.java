// --- File: user/controller/VerificationController.java ---
package vn.bds360.backend.modules.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.annotation.ApiGlobalResponse;
import vn.bds360.backend.common.dto.request.BaseFilterRequest;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.common.dto.response.PageResponse;
import vn.bds360.backend.modules.user.dto.request.ReviewVerificationRequest;
import vn.bds360.backend.modules.user.dto.request.SubmitVerificationRequest;
import vn.bds360.backend.modules.user.dto.request.VerificationFilterRequest;
import vn.bds360.backend.modules.user.dto.response.VerificationResponse;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.service.VerificationService;
import vn.bds360.backend.security.annotation.CurrentUser;
import vn.bds360.backend.security.annotation.IsAdminOrModerator;
import vn.bds360.backend.security.annotation.RequireLogin;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@ApiGlobalResponse
@Tag(name = "verification", description = "Quản lý xác thực tài khoản (CCCD/CMND)")
public class VerificationController {

    private final VerificationService verificationService;

    // ==========================================
    // NHÓM API DÀNH CHO ADMIN / MODERATOR
    // ==========================================

    @GetMapping("/manage/verification-requests")
    @ResponseStatus(HttpStatus.OK)
    @IsAdminOrModerator
    public ApiResponse<PageResponse<VerificationResponse>> getVerificationRequests(
            @Valid @ModelAttribute VerificationFilterRequest filter) {
        return ApiResponse.success(
                verificationService.getVerificationRequests(filter),
                "Lấy danh sách yêu cầu xác thực thành công");
    }

    @PutMapping("/manage/verification-requests/{requestId}/review")
    @ResponseStatus(HttpStatus.OK)
    @IsAdminOrModerator
    public ApiResponse<Void> reviewVerification(
            @PathVariable Long requestId,
            @Valid @RequestBody ReviewVerificationRequest request) {
        verificationService.reviewRequest(requestId, request);
        return ApiResponse.success(null, "Đã xử lý hồ sơ xác thực.");
    }

    // 🌟 API đã được cập nhật để gọi logic "Smart Latest" của bạn
    @GetMapping("/manage/verification-requests/users/{userId}/latest")
    @ResponseStatus(HttpStatus.OK)
    @IsAdminOrModerator
    public ApiResponse<VerificationResponse> getLatestVerification(@PathVariable Long userId) {
        return ApiResponse.success(
                verificationService.getLatestVerificationInfo(userId), // 👈 Đã đổi tên hàm ở đây
                "Lấy hồ sơ xác thực mới nhất thành công");
    }

    @GetMapping("/users/verification/latest")
    @ResponseStatus(HttpStatus.OK)
    @RequireLogin
    public ApiResponse<VerificationResponse> getMyLatestVerification(@CurrentUser User user) {
        // Tái sử dụng hàm của Service, nhưng ép cứng ID là của người đang đăng nhập
        return ApiResponse.success(
                verificationService.getLatestVerificationInfo(user.getId()),
                "Lấy hồ sơ xác thực mới nhất thành công");
    }

    // ==========================================
    // NHÓM API DÀNH CHO NGƯỜI DÙNG (USER)
    // ==========================================

    @PostMapping("/users/verification/submit")
    @ResponseStatus(HttpStatus.CREATED)
    @RequireLogin
    public ApiResponse<Void> submitVerification(
            @CurrentUser User user,
            @Valid @RequestBody SubmitVerificationRequest request) {
        verificationService.submitRequest(user.getEmail(), request);
        return ApiResponse.success(null, "Đã gửi yêu cầu xác thực. Vui lòng chờ hệ thống kiểm duyệt.");
    }

    @GetMapping("/users/verification/history")
    @ResponseStatus(HttpStatus.OK)
    @RequireLogin
    public ApiResponse<PageResponse<VerificationResponse>> getMyVerificationHistory(
            @CurrentUser User user,
            @Valid @ModelAttribute BaseFilterRequest filter) {

        return ApiResponse.success(
                verificationService.getMyVerificationHistory(user.getId(), filter),
                "Lấy lịch sử xác thực thành công");
    }
}