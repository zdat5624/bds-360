package vn.bds360.backend.modules.address.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.modules.address.dto.response.CoordinateResponse;
import vn.bds360.backend.modules.address.entity.District;
import vn.bds360.backend.modules.address.entity.Province;
import vn.bds360.backend.modules.address.entity.Ward;
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

    public List<Province> getAllProvinces() {
        return provinceRepository.findAll();
    }

    public List<District> getDistrictsByProvince(Long provinceCode) {
        return districtRepository.findByProvinceCode(provinceCode);
    }

    public List<Ward> getWardsByDistrict(Long districtCode) {
        return wardRepository.findByDistrictCode(districtCode);
    }

    public CoordinateResponse getCoordinates(String address) {
        return mapboxGeocodeService.getLatLngFromAddress(address)
                // Lưu ý: Mapbox trả về [Longitude, Latitude]
                .map(coords -> new CoordinateResponse(coords[1], coords[0]))
                // Sử dụng AppException chuẩn của hệ thống, vứt bỏ InputInvalidException
                .orElseThrow(() -> new AppException(ErrorCode.GEOCODE_FAILED));
    }
}
