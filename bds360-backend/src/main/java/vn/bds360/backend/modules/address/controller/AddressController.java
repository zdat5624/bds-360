package vn.bds360.backend.modules.address.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.modules.address.dto.response.CoordinateResponse;
import vn.bds360.backend.modules.address.entity.District;
import vn.bds360.backend.modules.address.entity.Province;
import vn.bds360.backend.modules.address.entity.Ward;
import vn.bds360.backend.modules.address.service.AddressService;

import java.util.List;

@RestController
@RequestMapping("/api/address")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping("/provinces")
    public ApiResponse<List<Province>> getProvinces() {
        return ApiResponse.success(addressService.getAllProvinces());
    }

    @GetMapping("/districts/{code}")
    public ApiResponse<List<District>> getDistricts(@PathVariable("code") long code) {
        return ApiResponse.success(addressService.getDistrictsByProvince(code));
    }

    @GetMapping("/wards/{code}")
    public ApiResponse<List<Ward>> getWards(@PathVariable("code") long code) {
        return ApiResponse.success(addressService.getWardsByDistrict(code));
    }

    @GetMapping("/geocode")
    public ApiResponse<CoordinateResponse> getCoordinatesFromAddress(@RequestParam("address") String address) {
        // Gọn gàng và súc tích!
        return ApiResponse.success(addressService.getCoordinates(address));
    }
}