// vn.bds360.backend.modules.notification.dto.request.NotificationFilterRequest
package vn.bds360.backend.modules.notification.dto.request;

import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.NotificationType;
import vn.bds360.backend.common.dto.request.BaseFilterRequest;

@Getter
@Setter
public class NotificationFilterRequest extends BaseFilterRequest {
    private Boolean isRead;
    private NotificationType type;
}