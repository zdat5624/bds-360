package vn.bds360.backend.modules.statistic.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.annotation.ApiGlobalResponse;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.modules.statistic.dto.response.SystemOverviewResponse;
import vn.bds360.backend.modules.statistic.service.SystemOverviewService;
import vn.bds360.backend.security.annotation.IsAdminOrModerator;

@RestController
@RequestMapping("/api/v1/manage/statistics/overview")
@RequiredArgsConstructor
@ApiGlobalResponse
@Tag(name = "manage-system-overview", description = "Quản trị viên - Dashboard Tổng quan hệ thống")
public class SystemOverviewController {

    private final SystemOverviewService systemOverviewService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @IsAdminOrModerator
    @Operation(summary = "Lấy dữ liệu toàn cảnh hệ thống (Doanh thu, Vận hành, Xu hướng)")
    public ApiResponse<SystemOverviewResponse> getSystemOverviewStats(
            @RequestParam(defaultValue = "30") Integer days) {

        return ApiResponse.success(
                systemOverviewService.getSystemOverview(days),
                "Lấy dữ liệu tổng quan hệ thống thành công");
    }
}
