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
import vn.bds360.backend.modules.statistic.dto.response.ManageUserStatisticsResponse;
import vn.bds360.backend.modules.statistic.service.ManageUserStatisticsService;
import vn.bds360.backend.security.annotation.IsAdminOrModerator;

@RestController
@RequestMapping("/api/v1/manage/statistics/users")
@RequiredArgsConstructor
@ApiGlobalResponse
@Tag(name = "manage-user-statistics", description = "Quản trị viên - Thống kê người dùng")
public class ManageUserStatisticsController {

    private final ManageUserStatisticsService manageUserStatisticsService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @IsAdminOrModerator // 🌟 Admin và Mod đều có quyền xem
    @Operation(summary = "Lấy dữ liệu Dashboard thống kê người dùng (KPIs & Biểu đồ)")
    public ApiResponse<ManageUserStatisticsResponse> getUserDashboardStats(
            @RequestParam(defaultValue = "30") Integer days) {

        return ApiResponse.success(
                manageUserStatisticsService.getDashboardStatistics(days),
                "Lấy dữ liệu thống kê người dùng thành công");
    }
}