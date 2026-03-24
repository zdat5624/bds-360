package vn.bds360.backend.modules.vip.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.bds360.backend.common.exception.InputInvalidException;
import vn.bds360.backend.modules.vip.entity.Vip;
import vn.bds360.backend.modules.vip.service.VipService;

@RestController
public class VipController {
    private final VipService vipService;

    public VipController(VipService vipService) {
        this.vipService = vipService;
    }

    @GetMapping("api/vips")
    public ResponseEntity<List<Vip>> getAllVips() {
        List<Vip> vips = vipService.getAllVips();
        return ResponseEntity.ok(vips);
    }

    @PutMapping("api/admin/vips/{id}/price")
    public ResponseEntity<Vip> updateVipPrice(@PathVariable Long id, @RequestParam long newPrice)
            throws InputInvalidException {
        Vip updatedVip = vipService.updateVipPrice(id, newPrice);
        return ResponseEntity.ok(updatedVip);
    }

    @GetMapping("api/vips/test")
    public ResponseEntity<List<Vip>> getAllVipss() {
        List<Vip> vips = vipService.getAllVips();
        return ResponseEntity.ok(vips);
    }
}
