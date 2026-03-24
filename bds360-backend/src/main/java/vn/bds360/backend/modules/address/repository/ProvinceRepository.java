package vn.bds360.backend.modules.address.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.bds360.backend.modules.address.entity.Province;

@Repository
public interface ProvinceRepository extends JpaRepository<Province, Long> {
}
