// --- File: address\controller\AddressController.java ---
package vn.bds360.backend.modules.address.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.annotation.ApiGlobalResponse;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.modules.address.dto.response.CoordinateResponse;
import vn.bds360.backend.modules.address.dto.response.DistrictResponse;
import vn.bds360.backend.modules.address.dto.response.ProvinceResponse;
import vn.bds360.backend.modules.address.dto.response.WardResponse;
import vn.bds360.backend.modules.address.service.AddressService;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@ApiGlobalResponse
@Tag(name = "addresses", description = "Quản lý dữ liệu Tỉnh/Thành, Quận/Huyện, Phường/Xã")
public class AddressController {

    private final AddressService addressService;

    // 1. Lấy danh sách Tỉnh/Thành
    @GetMapping("/provinces")
    public ApiResponse<List<ProvinceResponse>> getProvinces() {
        return ApiResponse.success(addressService.getAllProvinces(), "Lấy danh sách tỉnh/thành thành công");
    }

    // 2. Lấy Quận/Huyện THUỘC VỀ một Tỉnh/Thành cụ thể
    @GetMapping("/provinces/{provinceCode}/districts")
    public ApiResponse<List<DistrictResponse>> getDistricts(@PathVariable("provinceCode") long provinceCode) {
        return ApiResponse.success(addressService.getDistrictsByProvince(provinceCode),
                "Lấy danh sách quận/huyện thành công");
    }

    // 3. Lấy Phường/Xã THUỘC VỀ một Quận/Huyện cụ thể
    @GetMapping("/districts/{districtCode}/wards")
    public ApiResponse<List<WardResponse>> getWards(@PathVariable("districtCode") long districtCode) {
        return ApiResponse.success(addressService.getWardsByDistrict(districtCode),
                "Lấy danh sách phường/xã thành công");
    }

    // 4. Các API tiện ích rời rạc
    @GetMapping("/addresses/geocode")
    public ApiResponse<CoordinateResponse> getCoordinatesFromAddress(@RequestParam("address") String address) {
        return ApiResponse.success(addressService.getCoordinates(address), "Lấy tọa độ thành công");
    }
}