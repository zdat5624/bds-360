package vn.bds360.backend.modules.statistics.controller;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.modules.statistics.dto.response.AdminStatisticsResponse;
import vn.bds360.backend.modules.statistics.dto.response.MonthlyRevenueResponse;
import vn.bds360.backend.modules.statistics.service.AdminStatisticsService;
import vn.bds360.backend.security.annotation.IsAdmin;

@RestController
@RequestMapping("/api/v1/admin/statistics")
@RequiredArgsConstructor
@Validated
public class AdminStatisticsController {

    private final AdminStatisticsService adminStatisticsService;

    @GetMapping
    @IsAdmin
    public ApiResponse<AdminStatisticsResponse> getStatistics() {
        return ApiResponse.success(adminStatisticsService.getStatistics(), "Lấy thống kê tổng quan thành công");
    }

    @GetMapping("/revenue-by-month")
    @IsAdmin
    public ApiResponse<List<MonthlyRevenueResponse>> getMonthlyRevenue(
            @RequestParam("year") @Min(value = 2000, message = "Năm phải lớn hơn hoặc bằng 2000") Integer year) {
        return ApiResponse.success(adminStatisticsService.getMonthlyRevenue(year),
                "Lấy doanh thu theo tháng thành công");
    }
}