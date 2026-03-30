package vn.bds360.backend.modules.vip.service;

import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.modules.vip.dto.request.UpdateVipPriceRequest;
import vn.bds360.backend.modules.vip.dto.response.VipResponse;
import vn.bds360.backend.modules.vip.entity.Vip;
import vn.bds360.backend.modules.vip.mapper.VipMapper;
import vn.bds360.backend.modules.vip.repository.VipRepository;

@Service
@RequiredArgsConstructor
public class VipService {

    private final VipRepository vipRepository;
    private final VipMapper vipMapper;

    public List<VipResponse> getAllVips() {
        return vipRepository.findAll().stream()
                .map(vipMapper::toVipResponse)
                .collect(Collectors.toList());
    }

    public VipResponse updateVipPrice(Long vipId, UpdateVipPriceRequest request) {
        Vip vip = vipRepository.findById(vipId)
                .orElseThrow(() -> new AppException(ErrorCode.VIP_NOT_FOUND));

        vip.setPricePerDay(request.getNewPrice());
        vip = vipRepository.save(vip);

        return vipMapper.toVipResponse(vip);
    }
}