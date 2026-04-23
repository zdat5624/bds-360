// --- File: user/mapper/VerificationMapper.java ---
package vn.bds360.backend.modules.user.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import vn.bds360.backend.common.mapper.MapperConfiguration;
import vn.bds360.backend.modules.user.dto.response.VerificationResponse;
import vn.bds360.backend.modules.user.entity.VerificationSubmission; // 🌟 Đổi import

@Mapper(config = MapperConfiguration.class)
public interface VerificationMapper {

    // Map các trường lồng nhau (nested fields) từ entity User sang Response
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", source = "user.name")
    @Mapping(target = "userEmail", source = "user.email")
    @Mapping(target = "userAvatar", source = "user.avatar")
    VerificationResponse toResponse(VerificationSubmission verificationSubmission); // 🌟 Đổi kiểu tham số

}