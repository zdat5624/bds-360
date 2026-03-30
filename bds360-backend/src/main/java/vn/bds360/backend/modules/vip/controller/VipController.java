package vn.bds360.backend.modules.vip.controller;

import java.util.List;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.modules.vip.dto.request.UpdateVipPriceRequest;
import vn.bds360.backend.modules.vip.dto.response.VipResponse;
import vn.bds360.backend.modules.vip.service.VipService;
import vn.bds360.backend.security.annotation.IsAdmin;

@RestController
@RequestMapping("/api/v1") // Đồng bộ version
@RequiredArgsConstructor
public class VipController {

    private final VipService vipService;

    @GetMapping("/vips")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<VipResponse>> getAllVips() {
        return ApiResponse.success(vipService.getAllVips(), "Lấy danh sách gói VIP thành công");
    }

    @PutMapping("/admin/vips/{id}/price")
    @ResponseStatus(HttpStatus.OK)
    @IsAdmin
    public ApiResponse<VipResponse> updateVipPrice(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateVipPriceRequest request) {

        VipResponse updatedVip = vipService.updateVipPrice(id, request);
        return ApiResponse.success(updatedVip, "Cập nhật giá gói VIP thành công");
    }
}