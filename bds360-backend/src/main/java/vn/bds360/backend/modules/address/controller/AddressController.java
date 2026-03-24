package vn.bds360.backend.modules.address.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.bds360.backend.common.exception.InputInvalidException;
import vn.bds360.backend.modules.address.dto.response.CoordinateResponse;
import vn.bds360.backend.modules.address.entity.District;
import vn.bds360.backend.modules.address.entity.Province;
import vn.bds360.backend.modules.address.entity.Ward;
import vn.bds360.backend.modules.address.service.AddressService;
import vn.bds360.backend.modules.address.service.MapboxGeocodeService;



@RestController
public class AddressController {

    private AddressService addressService;
    private MapboxGeocodeService mapboxGeocodeService;

    public AddressController(AddressService addressService, MapboxGeocodeService mapboxGeocodeService) {
        this.addressService = addressService;
        this.mapboxGeocodeService = mapboxGeocodeService;
    }

    @GetMapping("/api/address/provinces")
    public ResponseEntity<List<Province>> getProvinces() {
        return ResponseEntity.ok(addressService.getAllProvinces());
    }

    @GetMapping("/api/address/districts/{code}")
    public ResponseEntity<List<District>> getDistricts(@PathVariable("code") long code) {
        return ResponseEntity.ok(addressService.getDistrictsByProvince(code));
    }

    @GetMapping("/api/address/wards/{code}")
    public ResponseEntity<List<Ward>> getWards(@PathVariable("code") long code) {
        return ResponseEntity.ok(addressService.getWardsByDistrict(code));
    }

    @GetMapping("/api/address/geocode")
    public ResponseEntity<CoordinateResponse> getCoordinatesFromAddress(@RequestParam("address") String address)
            throws InputInvalidException {
        return mapboxGeocodeService.getLatLngFromAddress(address)
                .map(coords -> ResponseEntity.ok().body(new CoordinateResponse(coords[1], coords[0])))
                .orElseThrow(() -> new InputInvalidException("Không tìm thấy tọa độ từ địa chỉ được cung cấp."));
    }
}
