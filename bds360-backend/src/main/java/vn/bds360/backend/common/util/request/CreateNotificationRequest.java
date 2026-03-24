package vn.bds360.backend.common.util.request;

import lombok.Data;
import vn.bds360.backend.common.constant.NotificationType;

@Data
public class CreateNotificationRequest {
    public Long userId;
    public String message;
    public NotificationType type;
}
