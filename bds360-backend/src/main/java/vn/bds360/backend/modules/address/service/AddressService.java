package vn.bds360.backend.modules.address.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.modules.address.dto.response.CoordinateResponse;
import vn.bds360.backend.modules.address.dto.response.DistrictResponse;
import vn.bds360.backend.modules.address.dto.response.ProvinceResponse;
import vn.bds360.backend.modules.address.dto.response.WardResponse;
import vn.bds360.backend.modules.address.mapper.AddressMapper;
import vn.bds360.backend.modules.address.repository.DistrictRepository;
import vn.bds360.backend.modules.address.repository.ProvinceRepository;
import vn.bds360.backend.modules.address.repository.WardRepository;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;
    private final MapboxGeocodeService mapboxGeocodeService;
    private final AddressMapper addressMapper; // <-- Inject Mapper vào đây

    public List<ProvinceResponse> getAllProvinces() {
        return addressMapper.toProvinceResponseList(provinceRepository.findAll());
    }

    public List<DistrictResponse> getDistrictsByProvince(Long provinceCode) {
        return addressMapper.toDistrictResponseList(districtRepository.findByProvinceCode(provinceCode));
    }

    public List<WardResponse> getWardsByDistrict(Long districtCode) {
        return addressMapper.toWardResponseList(wardRepository.findByDistrictCode(districtCode));
    }

    public CoordinateResponse getCoordinates(String address) {
        return mapboxGeocodeService.getLatLngFromAddress(address)
                // Lưu ý: Mapbox trả về [Longitude, Latitude]
                .map(coords -> new CoordinateResponse(coords[1], coords[0]))
                .orElseThrow(() -> new AppException(ErrorCode.GEOCODE_FAILED));
    }
}