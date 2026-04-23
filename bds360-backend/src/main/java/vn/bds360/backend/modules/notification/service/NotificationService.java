package vn.bds360.backend.modules.notification.service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
import vn.bds360.backend.modules.notification.dto.request.NotificationFilterRequest;
import vn.bds360.backend.modules.notification.dto.request.ViewPhoneNotificationRequest;
import vn.bds360.backend.modules.notification.dto.response.NotificationCountResponse;
import vn.bds360.backend.modules.notification.dto.response.NotificationResponse;
import vn.bds360.backend.modules.notification.entity.Notification;
import vn.bds360.backend.modules.notification.mapper.NotificationMapper;
import vn.bds360.backend.modules.notification.repository.NotificationRepository;
import vn.bds360.backend.modules.post.entity.Post;
import vn.bds360.backend.modules.post.repository.PostRepository;
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
    private final PostRepository postRepository;

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

    public PageResponse<NotificationResponse> getUserNotifications(User user, NotificationFilterRequest request) {
        // 1. Tạo đối tượng Pageable từ BaseFilterRequest
        Pageable pageable = PageRequest.of(
                request.getPage(),
                request.getSize(),
                Sort.by(request.getSortDirection(), request.getSortBy()));

        // 2. Truy vấn dữ liệu với các filter đặc thù
        var page = notificationRepository.findByUserAndFilters(
                user.getId(),
                request.getIsRead(),
                request.getType(),
                pageable);

        // 3. Map sang DTO Response
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
        // Admin/Mod xem thì không cần thông báo làm phiền chủ tin
        if (currentUser.getRole() == Role.ADMIN || currentUser.getRole() == Role.MODERATOR)
            return;

        User recipient = userService.fetchUserById(request.getRecipientId());
        if (recipient == null)
            throw new AppException(ErrorCode.USER_NOT_FOUND);

        // Xử lý thông báo linh hoạt tùy theo việc có truyền postId hay không
        String message;

        if (request.getPostId() != null) {
            // 🌟 KIỂM TRA VIP LEVEL CỦA TIN ĐĂNG
            Post post = postRepository.findById(request.getPostId()).orElse(null);

            // Nếu không tìm thấy post, hoặc post có vipLevel < 2 thì KHÔNG gửi thông báo
            if (post == null || post.getVip() == null || post.getVip().getVipLevel() < 2) {
                return;
            }

            // Trường hợp 1: Khách xem số điện thoại ở trang chi tiết tin đăng (thỏa mãn VIP
            // >= 2)
            message = String.format("Người dùng '%s - %s' đã xem số điện thoại của tin đăng mã #'%d' của bạn.",
                    currentUser.getName(), currentUser.getPhone(), request.getPostId());
        } else {
            // Trường hợp 2: Khách xem số điện thoại ở trang hồ sơ cá nhân (không gắn với
            // post cụ thể)
            message = String.format("Người dùng '%s - %s' đã xem số điện thoại trên trang hồ sơ của bạn.",
                    currentUser.getName(), currentUser.getPhone());
        }

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
        // Lấy danh sách thống kê thay vì một con số tổng
        List<NotificationCountResponse> detailedCounts = this.getUnreadCountsByUserId(userId);

        // Đẩy List DTO này thành JSON Array qua WebSocket
        messagingTemplate.convertAndSendToUser(String.valueOf(userId), "/topic/notifications", detailedCounts);
        messagingTemplate.convertAndSendToUser(String.valueOf(userId), "/user/notifications", detailedCounts);
    }

    // Public API gọi từ Controller
    public List<NotificationCountResponse> getUnreadCounts(User user) {
        return this.getUnreadCountsByUserId(user.getId());
    }

    // Tách logic lõi ra hàm private để tái sử dụng
    private List<NotificationCountResponse> getUnreadCountsByUserId(Long userId) {
        Iterable<Object[]> results = notificationRepository.countUnreadByType(userId);
        Map<NotificationType, Long> rawMap = new EnumMap<>(NotificationType.class);

        for (Object[] result : results) {
            rawMap.put((NotificationType) result[0], (Long) result[1]);
        }

        return Stream.of(NotificationType.values())
                .map(type -> NotificationCountResponse.builder()
                        .type(type)
                        .count(rawMap.getOrDefault(type, 0L))
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteNotifications(User user, List<Long> ids) {
        if (ids == null || ids.isEmpty())
            return;

        notificationRepository.deleteByIdInAndUserId(ids, user.getId());

        // Đẩy lại số lượng chưa đọc mới sau khi xóa (vì có thể user xóa tin chưa đọc)
        this.pushUnreadCount(user.getId());

        log.info(">>> Đã xóa {} thông báo cho User ID: {}", ids.size(), user.getId());
    }

}