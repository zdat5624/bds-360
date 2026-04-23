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
import vn.bds360.backend.modules.statistic.dto.response.ManagePostStatisticsResponse;
import vn.bds360.backend.modules.statistic.service.ManagePostStatisticsService;
import vn.bds360.backend.security.annotation.IsAdminOrModerator;

@RestController
@RequestMapping("/api/v1/manage/statistics/posts")
@RequiredArgsConstructor
@ApiGlobalResponse
@Tag(name = "manage-post-statistics", description = "Quản trị viên - Thống kê Tin đăng")
public class ManagePostStatisticsController {

    private final ManagePostStatisticsService postStatisticsService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @IsAdminOrModerator
    @Operation(summary = "Lấy dữ liệu Dashboard thống kê Tin đăng (Nguồn cung, lượt xem, backlog)")
    public ApiResponse<ManagePostStatisticsResponse> getPostDashboardStats(
            @RequestParam(defaultValue = "30") Integer days) {

        return ApiResponse.success(
                postStatisticsService.getPostDashboard(days),
                "Lấy dữ liệu thống kê tin đăng thành công");
    }
}