package vn.bds360.backend.modules.notification.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.bds360.backend.common.constant.NotificationType;
import vn.bds360.backend.common.exception.InputInvalidException;
import vn.bds360.backend.modules.notification.entity.Notification;
import vn.bds360.backend.modules.notification.repository.NotificationRepository;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.service.UserService;
import vn.bds360.backend.security.SecurityUtil;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate,
            UserService userService) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
    }

    public Page<Notification> getUserNotifications(Boolean isRead, NotificationType type, Pageable pageable)
            throws Exception {
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new InputInvalidException("Chưa đăng nhập"));
        User user = userService.handleGetUserByUserName(email);
        if (user == null) {
            throw new InputInvalidException("Không tìm thấy người dùng");
        }
        return notificationRepository.findByUserAndFilters(user.getId(), isRead, type, pageable);
    }

    @Transactional
    public Notification createNotification(Notification notification) {
        Notification savedNotification = notificationRepository.save(notification);
        Long userId = notification.getUser().getId();
        long unreadCount = getUnreadNotificationCount(userId);
        messagingTemplate.convertAndSendToUser(
                String.valueOf(userId),
                "/topic/notifications",
                unreadCount);

        messagingTemplate.convertAndSendToUser(
                String.valueOf(userId),
                "/user/notifications",
                unreadCount);

        return savedNotification;
    }

    public long getUnreadNotificationCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public int deleteNotifications(List<Long> ids) throws InputInvalidException {
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new InputInvalidException("Chưa đăng nhập"));
        User user = userService.handleGetUserByUserName(email);
        if (user == null) {
            throw new InputInvalidException("Không tìm thấy người dùng");
        }
        int deletedCount = notificationRepository.deleteByIdsAndUserId(ids, user.getId());
        long unreadCount = getUnreadNotificationCount(user.getId());
        messagingTemplate.convertAndSendToUser(
                String.valueOf(user.getId()),
                "/topic/notifications",
                unreadCount);
        return deletedCount;
    }

    @Transactional
    public int markNotificationsAsRead(List<Long> ids) throws InputInvalidException {
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new InputInvalidException("Chưa đăng nhập"));
        User user = userService.handleGetUserByUserName(email);
        if (user == null) {
            throw new InputInvalidException("Không tìm thấy người dùng");
        }
        int updatedCount = notificationRepository.markAsReadByIdsAndUserId(ids, user.getId());
        long unreadCount = getUnreadNotificationCount(user.getId());
        messagingTemplate.convertAndSendToUser(
                String.valueOf(user.getId()),
                "/topic/notifications",
                unreadCount);
        return updatedCount;
    }

    @Transactional
    public int markAllNotificationsAsRead() throws InputInvalidException {
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new InputInvalidException("Chưa đăng nhập"));
        User user = userService.handleGetUserByUserName(email);
        if (user == null) {
            throw new InputInvalidException("Không tìm thấy người dùng");
        }
        int updatedCount = notificationRepository.markAllAsReadByUserId(user.getId());
        long unreadCount = getUnreadNotificationCount(user.getId());
        messagingTemplate.convertAndSendToUser(
                String.valueOf(user.getId()),
                "/topic/notifications",
                unreadCount);
        return updatedCount;
    }

    public Map<NotificationType, Long> getUnreadCountByType() throws InputInvalidException {
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new InputInvalidException("Chưa đăng nhập"));
        User user = userService.handleGetUserByUserName(email);
        if (user == null) {
            throw new InputInvalidException("Không tìm thấy người dùng");
        }
        Iterable<Object[]> results = notificationRepository.countUnreadByType(user.getId());
        Map<NotificationType, Long> unreadCounts = new HashMap<>();
        for (Object[] result : results) {
            NotificationType type = (NotificationType) result[0];
            Long count = (Long) result[1];
            unreadCounts.put(type, count);
        }
        for (NotificationType type : NotificationType.values()) {
            unreadCounts.putIfAbsent(type, 0L);
        }
        return unreadCounts;
    }

    public boolean existsByMessage(String message) {
        return notificationRepository.existsByMessage(message);
    }
}