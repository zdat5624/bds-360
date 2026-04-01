package vn.bds360.backend.modules.notification.controller;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.bds360.backend.common.constant.NotificationType;
import vn.bds360.backend.common.constant.RoleEnum;
import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.common.exception.InputInvalidException;
import vn.bds360.backend.common.exception.PermissionException;
import vn.bds360.backend.modules.notification.dto.request.CreateNotificationRequest;
import vn.bds360.backend.modules.notification.dto.request.ViewPhoneNotificationRequest;
import vn.bds360.backend.modules.notification.entity.Notification;
import vn.bds360.backend.modules.notification.service.NotificationService;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.service.UserService;
import vn.bds360.backend.security.SecurityUtil;

@RestController
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @GetMapping("/api/notifications")
    public ResponseEntity<Page<Notification>> getUserNotifications(
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(required = false) NotificationType type,
            Pageable pageable) throws Exception {
        Page<Notification> notifications = notificationService.getUserNotifications(isRead, type, pageable);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/api/notifications/unread-count")
    public ResponseEntity<Long> getUnreadNotificationCount() throws PermissionException {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        if (email.isEmpty()) {
            throw new PermissionException("Bạn chưa đăng nhập.");
        }
        User user = userService.handleGetUserByUserName(email);
        if (user == null || user.getRole() == null) {
            throw new PermissionException("Bạn không có quyền truy cập.");
        }
        long unreadCount = notificationService.getUnreadNotificationCount(user.getId());
        return ResponseEntity.ok(unreadCount);
    }

    @GetMapping("/api/notifications/unread-count-by-type")
    public ResponseEntity<Map<NotificationType, Long>> getUnreadCountByType()
            throws PermissionException, InputInvalidException {
        Map<NotificationType, Long> unreadCounts = notificationService.getUnreadCountByType();
        return ResponseEntity.ok(unreadCounts);
    }

    @PostMapping("/api/notifications/create")
    public ResponseEntity<Notification> createNotification(
            @RequestBody CreateNotificationRequest request) throws PermissionException {
        Notification notification = new Notification();
        User user = new User();
        user.setId(request.getUserId());
        notification.setUser(user);
        notification.setMessage(request.getMessage());
        notification.setType(request.getType());
        notification.setRead(false);
        Notification savedNotification = notificationService.createNotification(notification);
        return ResponseEntity.ok(savedNotification);
    }

    @DeleteMapping("/api/notifications")
    public ResponseEntity<Integer> deleteNotifications(
            @RequestBody List<Long> ids) throws PermissionException, InputInvalidException {
        int deletedCount = notificationService.deleteNotifications(ids);
        return ResponseEntity.ok(deletedCount);
    }

    @PutMapping("/api/notifications/mark-as-read")
    public ResponseEntity<Integer> markNotificationsAsRead(
            @RequestBody List<Long> ids) throws PermissionException, InputInvalidException {
        int updatedCount = notificationService.markNotificationsAsRead(ids);
        return ResponseEntity.ok(updatedCount);
    }

    @PutMapping("/api/notifications/mark-all-as-read")
    public ResponseEntity<Integer> markAllNotificationsAsRead() throws PermissionException, InputInvalidException {
        int updatedCount = notificationService.markAllNotificationsAsRead();
        return ResponseEntity.ok(updatedCount);
    }

    @PostMapping("/api/notifications/view-phone")
    public ResponseEntity<Notification> createViewPhoneNotification(
            @RequestBody ViewPhoneNotificationRequest request) throws Exception {
        // Kiểm tra người dùng đã đăng nhập
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        if (email.isEmpty()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);

        }

        // Lấy thông tin người dùng hiện tại
        User currentUser = userService.handleGetUserByUserName(email);
        if (currentUser == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        // Kiểm tra người nhận thông báo
        User recipient = userService.fetchUserById(request.getRecipientId());
        if (recipient == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        // Kiểm tra quyền: Không gửi thông báo nếu người xem là admin
        if (currentUser.getRole() != null && currentUser.getRole().equals(RoleEnum.ADMIN)) {
            throw new InputInvalidException("Admin không cần gửi thông báo khi xem số điện thoại.");
        }

        // Kiểm tra quyền: Không gửi thông báo nếu người xem là admin
        if (currentUser.getRole() != null && currentUser.getRole().equals(RoleEnum.ADMIN)) {
            throw new InputInvalidException("Admin không cần gửi thông báo khi xem số điện thoại.");
        }

        // Tạo nội dung thông báo
        String message = "Người dùng '" + currentUser.getName() + " - " + currentUser.getPhone() +
                "' đã xem số điện thoại của tin đăng mã '" + request.getPostId() + "' của bạn.";

        // Kiểm tra thông báo trùng lặp
        if (notificationService.existsByMessage(message)) {
            throw new InputInvalidException("Thông báo này đã tồn tại.");
        }

        // Tạo thông báo
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setUser(recipient); // Người nhận là chủ bài đăng
        notification.setType(NotificationType.POST);
        notification.setRead(false);

        // Lưu thông báo và gửi qua WebSocket
        Notification savedNotification = notificationService.createNotification(notification);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedNotification);
    }

}