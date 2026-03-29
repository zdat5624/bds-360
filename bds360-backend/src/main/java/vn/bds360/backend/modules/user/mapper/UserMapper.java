package vn.bds360.backend.modules.user.mapper;

import org.mapstruct.Mapper;

import org.mapstruct.MappingConstants;

import vn.bds360.backend.modules.user.dto.response.UserResponse;
import vn.bds360.backend.modules.user.entity.User;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {

    // 1. Hàm map Entity -> DTO
    UserResponse toUserResponse(User user);

}