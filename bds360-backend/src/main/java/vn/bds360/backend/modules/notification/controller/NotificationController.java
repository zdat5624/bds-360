package vn.bds360.backend.modules.notification.controller;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.annotation.ApiGlobalResponse;
import vn.bds360.backend.common.constant.NotificationType;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.common.dto.response.PageResponse;
import vn.bds360.backend.modules.notification.dto.request.ViewPhoneNotificationRequest;
import vn.bds360.backend.modules.notification.dto.response.NotificationCountResponse;
import vn.bds360.backend.modules.notification.dto.response.NotificationResponse;
import vn.bds360.backend.modules.notification.service.NotificationService;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.security.annotation.CurrentUser;
import vn.bds360.backend.security.annotation.RequireLogin;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@ApiGlobalResponse
@Tag(name = "notifications", description = "Quản lý thông báo của người dùng")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @RequireLogin
    public ApiResponse<PageResponse<NotificationResponse>> getMyNotifications(
            @CurrentUser User user,
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(required = false) NotificationType type,
            Pageable pageable) {
        return ApiResponse.success(notificationService.getUserNotifications(user, isRead, type, pageable));
    }

    @GetMapping("/unread-count")
    @RequireLogin
    public ApiResponse<Long> getUnreadCount(@CurrentUser User user) {
        return ApiResponse.success(notificationService.getUnreadCount(user));
    }

    @PutMapping("/mark-as-read")
    @RequireLogin
    public ApiResponse<Void> markAsRead(@CurrentUser User user, @RequestBody List<Long> ids) {
        notificationService.markAsRead(user, ids);
        return ApiResponse.success(null, "Thành công");
    }

    @PutMapping("/mark-all-as-read")
    @RequireLogin
    public ApiResponse<Void> markAllAsRead(@CurrentUser User user) {
        notificationService.markAllAsRead(user);
        return ApiResponse.success(null, "Thành công");
    }

    @PostMapping("/view-phone")
    @RequireLogin
    public ApiResponse<Void> notifyViewPhone(
            @CurrentUser User user,
            @RequestBody ViewPhoneNotificationRequest request) {
        notificationService.handleViewPhoneNotification(user, request);
        return ApiResponse.success(null, "Đã gửi thông báo");
    }

    @GetMapping("/unread-counts")
    @RequireLogin
    public ApiResponse<List<NotificationCountResponse>> getUnreadCounts(@CurrentUser User user) {
        return ApiResponse.success(
                notificationService.getUnreadCounts(user),
                "Lấy thống kê thông báo thành công");
    }
}