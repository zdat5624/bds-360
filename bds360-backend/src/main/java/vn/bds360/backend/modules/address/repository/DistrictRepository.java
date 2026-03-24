package vn.bds360.backend.modules.address.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.bds360.backend.modules.address.entity.District;

@Repository
public interface DistrictRepository extends JpaRepository<District, Long> {
    List<District> findByProvinceCode(Long provinceCode);
}
