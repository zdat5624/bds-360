// --- File: statistic/controller/UserStatisticsController.java ---
package vn.bds360.backend.modules.statistic.controller;

import java.util.List;

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
import vn.bds360.backend.modules.statistic.dto.response.UserDashboardResponse.CashFlow;
import vn.bds360.backend.modules.statistic.dto.response.UserDashboardResponse.KpiSummary;
import vn.bds360.backend.modules.statistic.dto.response.UserDashboardResponse.PostStatusBreakdown;
import vn.bds360.backend.modules.statistic.dto.response.UserDashboardResponse.TopPost;
import vn.bds360.backend.modules.statistic.dto.response.UserDashboardResponse.ViewTrend;
import vn.bds360.backend.modules.statistic.service.UserStatisticsService;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.security.annotation.CurrentUser;
import vn.bds360.backend.security.annotation.RequireLogin;

@RestController
@RequestMapping("/api/v1/users/statistics")
@RequiredArgsConstructor
@ApiGlobalResponse
@Tag(name = "user-statistics", description = "Dashboard thống kê dành riêng cho User (Khách hàng)")
public class UserStatisticsController {

    private final UserStatisticsService userStatisticsService;

    @GetMapping("/kpis")
    @ResponseStatus(HttpStatus.OK)
    @RequireLogin
    @Operation(summary = "Lấy 4 chỉ số KPI tổng quan")
    public ApiResponse<KpiSummary> getKpiSummary(@CurrentUser User user) {
        return ApiResponse.success(
                userStatisticsService.getKpiSummary(user),
                "Lấy các chỉ số tổng quan thành công");
    }

    @GetMapping("/charts/views")
    @ResponseStatus(HttpStatus.OK)
    @RequireLogin
    @Operation(summary = "Biểu đồ lượt xem tin đăng theo thời gian")
    public ApiResponse<List<ViewTrend>> getViewsChart(
            @CurrentUser User user,
            @RequestParam(defaultValue = "30") Integer days) {
        return ApiResponse.success(
                userStatisticsService.getViewsChart(user, days),
                "Lấy dữ liệu biểu đồ lượt xem thành công");
    }

    @GetMapping("/charts/post-statuses")
    @ResponseStatus(HttpStatus.OK)
    @RequireLogin
    @Operation(summary = "Biểu đồ cơ cấu trạng thái tin đăng")
    public ApiResponse<List<PostStatusBreakdown>> getPostStatusChart(@CurrentUser User user) {
        return ApiResponse.success(
                userStatisticsService.getPostStatusBreakdown(user),
                "Lấy dữ liệu biểu đồ trạng thái tin thành công");
    }

    @GetMapping("/charts/top-posts")
    @ResponseStatus(HttpStatus.OK)
    @RequireLogin
    @Operation(summary = "Danh sách top tin đăng hiệu quả nhất")
    public ApiResponse<List<TopPost>> getTopPosts(
            @CurrentUser User user,
            @RequestParam(defaultValue = "5") Integer limit) {
        return ApiResponse.success(
                userStatisticsService.getTopPosts(user, limit),
                "Lấy danh sách top tin đăng thành công");
    }

    @GetMapping("/charts/cash-flow")
    @ResponseStatus(HttpStatus.OK)
    @RequireLogin
    @Operation(summary = "Biểu đồ dòng tiền thu/chi")
    public ApiResponse<List<CashFlow>> getCashFlowChart(
            @CurrentUser User user,
            @RequestParam(defaultValue = "6") Integer months) {
        return ApiResponse.success(
                userStatisticsService.getCashFlowChart(user, months),
                "Lấy dữ liệu biểu đồ thu chi thành công");
    }
}