package vn.bds360.backend.modules.address.service;

import java.util.List;

import org.springframework.stereotype.Service;

import vn.bds360.backend.modules.address.entity.District;
import vn.bds360.backend.modules.address.entity.Province;
import vn.bds360.backend.modules.address.entity.Ward;
import vn.bds360.backend.modules.address.repository.DistrictRepository;
import vn.bds360.backend.modules.address.repository.ProvinceRepository;
import vn.bds360.backend.modules.address.repository.WardRepository;

@Service
public class AddressService {

    private final ProvinceRepository provinceRepository;

    private final DistrictRepository districtRepository;

    private final WardRepository wardRepository;

    public AddressService(ProvinceRepository provinceRepository, DistrictRepository districtRepository,
            WardRepository wardRepository) {

        this.provinceRepository = provinceRepository;
        this.districtRepository = districtRepository;
        this.wardRepository = wardRepository;
    }

    public List<Province> getAllProvinces() {
        return provinceRepository.findAll();
    }

    public List<District> getDistrictsByProvince(Long provinceCode) {
        return districtRepository.findByProvinceCode(provinceCode);
    }

    public List<Ward> getWardsByDistrict(Long districtCode) {
        return wardRepository.findByDistrictCode(districtCode);
    }
}
