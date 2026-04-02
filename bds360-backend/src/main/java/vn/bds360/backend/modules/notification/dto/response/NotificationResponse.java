package vn.bds360.backend.modules.notification.dto.response;

import java.time.Instant;

import lombok.Data;
import vn.bds360.backend.common.constant.NotificationType;

@Data
public class NotificationResponse {
    private Long id;
    private String message;
    private NotificationType type;
    private boolean isRead;
    private Instant createdAt;
}