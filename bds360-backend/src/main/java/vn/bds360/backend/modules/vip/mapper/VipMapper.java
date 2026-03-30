package vn.bds360.backend.modules.vip.mapper;

import org.mapstruct.Mapper;

import vn.bds360.backend.common.mapper.MapperConfiguration;
import vn.bds360.backend.modules.vip.dto.response.VipResponse;
import vn.bds360.backend.modules.vip.entity.Vip;

@Mapper(config = MapperConfiguration.class)
public interface VipMapper {
    VipResponse toVipResponse(Vip vip);
}