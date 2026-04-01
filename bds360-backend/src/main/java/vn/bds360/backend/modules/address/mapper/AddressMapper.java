package vn.bds360.backend.modules.address.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import vn.bds360.backend.common.mapper.MapperConfiguration;
import vn.bds360.backend.modules.address.dto.response.DistrictResponse;
import vn.bds360.backend.modules.address.dto.response.ProvinceResponse;
import vn.bds360.backend.modules.address.dto.response.WardResponse;
import vn.bds360.backend.modules.address.entity.District;
import vn.bds360.backend.modules.address.entity.Province;
import vn.bds360.backend.modules.address.entity.Ward;

@Mapper(config = MapperConfiguration.class)
public interface AddressMapper {

    // 1. Province Mapping
    ProvinceResponse toProvinceResponse(Province province);

    List<ProvinceResponse> toProvinceResponseList(List<Province> provinces);

    // 2. District Mapping
    DistrictResponse toDistrictResponse(District district);

    List<DistrictResponse> toDistrictResponseList(List<District> districts);

    // 3. Ward Mapping
    WardResponse toWardResponse(Ward ward);

    List<WardResponse> toWardResponseList(List<Ward> wards);
}