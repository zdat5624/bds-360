package vn.bds360.backend.modules.notification.service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.bds360.backend.common.constant.NotificationType;
import vn.bds360.backend.common.constant.Role;
import vn.bds360.backend.common.dto.response.PageResponse;
import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.modules.notification.dto.request.ViewPhoneNotificationRequest;
import vn.bds360.backend.modules.notification.dto.response.NotificationCountResponse;
import vn.bds360.backend.modules.notification.dto.response.NotificationResponse;
import vn.bds360.backend.modules.notification.entity.Notification;
import vn.bds360.backend.modules.notification.mapper.NotificationMapper;
import vn.bds360.backend.modules.notification.repository.NotificationRepository;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.service.UserService;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;
    private final NotificationMapper notificationMapper;

    /**
     * 1. HÀM CORE: TẠO THÔNG BÁO (Public cho toàn hệ thống)
     * Các Service khác (Payment, Post, Auth) sẽ gọi hàm này.
     */
    @Transactional
    public void createNotification(User recipient, String message, NotificationType type) {
        if (recipient == null)
            return;

        Notification notification = new Notification();
        notification.setUser(recipient);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);

        notificationRepository.save(notification);

        // Sau khi lưu, đẩy tín hiệu Real-time qua WebSocket
        this.pushUnreadCount(recipient.getId());

        log.info(">>> Đã tạo và đẩy thông báo thành công cho User ID: {}", recipient.getId());
    }

    /**
     * Overload: Tạo thông báo chỉ với UserId
     */
    @Transactional
    public void createNotification(Long userId, String message, NotificationType type) {
        User recipient = userService.fetchUserById(userId);
        if (recipient != null) {
            this.createNotification(recipient, message, type);
        }
    }

    /**
     * 2. LẤY DANH SÁCH THÔNG BÁO (Cho bản thân người dùng)
     */
    public PageResponse<NotificationResponse> getUserNotifications(User user, Boolean isRead, NotificationType type,
            Pageable pageable) {
        var page = notificationRepository.findByUserAndFilters(user.getId(), isRead, type, pageable);
        return PageResponse.of(page.map(notificationMapper::toResponse));
    }

    public boolean existsByMessage(String message) {
        return notificationRepository.existsByMessage(message);
    }

    /**
     * 3. ĐÁNH DẤU ĐÃ ĐỌC
     */
    @Transactional
    public void markAsRead(User user, List<Long> ids) {
        notificationRepository.markAsReadByIdsAndUserId(ids, user.getId());
        this.pushUnreadCount(user.getId());
    }

    @Transactional
    public void markAllAsRead(User user) {
        notificationRepository.markAllAsReadByUserId(user.getId());
        this.pushUnreadCount(user.getId());
    }

    /**
     * 4. LOGIC ĐẶC THÙ: THÔNG BÁO XEM SỐ ĐIỆN THOẠI
     */
    @Transactional
    public void handleViewPhoneNotification(User currentUser, ViewPhoneNotificationRequest request) {
        // Admin xem thì không cần thông báo làm phiền chủ tin
        if (currentUser.getRole() == Role.ADMIN)
            return;

        User recipient = userService.fetchUserById(request.getRecipientId());
        if (recipient == null)
            throw new AppException(ErrorCode.USER_NOT_FOUND);

        String message = String.format("Người dùng '%s - %s' đã xem số điện thoại của tin đăng mã '%d' của bạn.",
                currentUser.getName(), currentUser.getPhone(), request.getPostId());

        // Chống spam thông báo trùng lặp
        if (notificationRepository.existsByMessage(message))
            return;

        // Tái sử dụng hàm tạo thông báo ở trên
        this.createNotification(recipient, message, NotificationType.POST);
    }

    /**
     * 5. HELPER: ĐẨY SỐ LƯỢNG TIN CHƯA ĐỌC QUA WEBSOCKET
     */
    private void pushUnreadCount(Long userId) {
        long count = notificationRepository.countByUserIdAndIsReadFalse(userId);

        // Gửi tới cả 2 channel để Frontend dễ bắt (tùy config socket của bạn)
        messagingTemplate.convertAndSendToUser(String.valueOf(userId), "/topic/notifications", count);
        messagingTemplate.convertAndSendToUser(String.valueOf(userId), "/user/notifications", count);
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    public List<NotificationCountResponse> getUnreadCounts(User user) {
        // 1. Lấy dữ liệu từ Repo (vẫn dùng Map để xử lý trung gian cho nhanh)
        Iterable<Object[]> results = notificationRepository.countUnreadByType(user.getId());
        Map<NotificationType, Long> rawMap = new EnumMap<>(NotificationType.class);

        for (Object[] result : results) {
            rawMap.put((NotificationType) result[0], (Long) result[1]);
        }

        // 2. Chuyển đổi sang List DTO và bổ sung Label
        return Stream.of(NotificationType.values())
                .map(type -> NotificationCountResponse.builder()
                        .type(type)
                        .count(rawMap.getOrDefault(type, 0L))
                        .build())
                .collect(Collectors.toList());
    }

}