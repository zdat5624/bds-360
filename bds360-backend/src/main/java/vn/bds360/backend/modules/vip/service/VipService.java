package vn.bds360.backend.modules.vip.service;

import java.util.List;

import org.springframework.stereotype.Service;

import vn.bds360.backend.common.exception.InputInvalidException;
import vn.bds360.backend.modules.vip.entity.Vip;
import vn.bds360.backend.modules.vip.repository.VipRepository;

@Service
public class VipService {
    private final VipRepository vipRepository;

    public VipService(VipRepository vipRepository) {
        this.vipRepository = vipRepository;
    }

    public List<Vip> getAllVips() {
        return vipRepository.findAll();
    }

    public Vip updateVipPrice(Long vipId, long newPrice) throws InputInvalidException {
        Vip vip = vipRepository.findById(vipId)
                .orElseThrow(() -> new InputInvalidException("Không tìm thấy gói VIP với ID: " + vipId));

        vip.setPricePerDay(newPrice);
        return vipRepository.save(vip);
    }
}
