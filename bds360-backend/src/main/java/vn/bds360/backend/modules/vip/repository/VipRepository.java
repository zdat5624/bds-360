package vn.bds360.backend.modules.vip.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.bds360.backend.modules.vip.entity.Vip;

@Repository
public interface VipRepository extends JpaRepository<Vip, Long> {

}
