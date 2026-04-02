package vn.bds360.backend.modules.notification.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import vn.bds360.backend.modules.notification.dto.response.NotificationResponse;
import vn.bds360.backend.modules.notification.entity.Notification;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface NotificationMapper {

    NotificationResponse toResponse(Notification notification);
}