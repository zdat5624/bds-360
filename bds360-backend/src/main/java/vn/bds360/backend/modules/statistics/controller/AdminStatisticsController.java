package vn.bds360.backend.modules.statistics.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.constraints.Min;
import vn.bds360.backend.modules.statistics.dto.response.AdminStatisticsDTO;
import vn.bds360.backend.modules.statistics.dto.response.MonthlyRevenueDTO;
import vn.bds360.backend.modules.statistics.service.AdminStatisticsService;

@RestController
@RequestMapping("/api/admin/statistics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStatisticsController {

    @Autowired
    private AdminStatisticsService adminStatisticsService;

    @GetMapping
    public ResponseEntity<AdminStatisticsDTO> getStatistics() {
        AdminStatisticsDTO statistics = adminStatisticsService.getStatistics();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/revenue-by-month")
    public ResponseEntity<List<MonthlyRevenueDTO>> getMonthlyRevenue(
            @RequestParam("year") @Min(value = 2000, message = "Year must be greater than or equal to 2000") Integer year) {
        List<MonthlyRevenueDTO> monthlyRevenues = adminStatisticsService.getMonthlyRevenue(year);
        return ResponseEntity.ok(monthlyRevenues);
    }
}