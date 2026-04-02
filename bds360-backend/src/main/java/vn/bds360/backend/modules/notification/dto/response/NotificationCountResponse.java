package vn.bds360.backend.modules.notification.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.bds360.backend.common.constant.NotificationType;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationCountResponse {
    private NotificationType type;
    private long count;
}