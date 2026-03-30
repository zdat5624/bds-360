package vn.bds360.backend.modules.user.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.bds360.backend.common.mapper.MapperConfiguration;
import vn.bds360.backend.modules.auth.dto.request.RegisterRequest;
import vn.bds360.backend.modules.user.dto.request.CreateUserRequest;
import vn.bds360.backend.modules.user.dto.request.UpdateProfileRequest;
import vn.bds360.backend.modules.user.dto.request.UpdateUserRequest;
import vn.bds360.backend.modules.user.dto.response.UserResponse;
import vn.bds360.backend.modules.user.entity.User;

@Mapper(config = MapperConfiguration.class)
public interface UserMapper {

    UserResponse toUserResponse(User user);

    // 1. Chuyển DTO của Admin thành Entity
    User toUser(CreateUserRequest request);

    // 2. Chuyển DTO của Khách thành Entity
    User toUser(RegisterRequest request);

    // 2. Map dữ liệu từ Admin Update Request vào Entity hiện tại (Bỏ qua trường
    // null)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUserFromRequest(UpdateUserRequest request, @MappingTarget User user);

    // 3. Map dữ liệu từ User Profile Request vào Entity hiện tại (Bỏ qua trường
    // null)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateProfileFromRequest(UpdateProfileRequest request, @MappingTarget User user);
}