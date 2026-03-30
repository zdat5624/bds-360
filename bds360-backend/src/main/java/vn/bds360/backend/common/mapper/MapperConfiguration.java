package vn.bds360.backend.common.mapper;

import org.mapstruct.MapperConfig;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@MapperConfig(componentModel = MappingConstants.ComponentModel.SPRING
// Bỏ qua cảnh báo vàng chói mắt khi DTO không có đủ các trường của Entity
        , unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MapperConfiguration {
}