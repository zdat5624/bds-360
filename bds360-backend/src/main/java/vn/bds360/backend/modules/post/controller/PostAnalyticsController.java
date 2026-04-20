package vn.bds360.backend.modules.post.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.annotation.ApiGlobalResponse;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.modules.post.dto.request.PriceHistoryRequest;
import vn.bds360.backend.modules.post.dto.response.NearbyLocationPriceResponse;
import vn.bds360.backend.modules.post.dto.response.PostViewChartResponse;
import vn.bds360.backend.modules.post.dto.response.PriceHistoryResponse;
import vn.bds360.backend.modules.post.service.PostAnalyticsService;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.security.annotation.CurrentUser;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
@Validated
@ApiGlobalResponse
@Tag(name = "post-analytics", description = "Quản lý tương tác và thống kê tin đăng")
public class PostAnalyticsController {

    private final PostAnalyticsService postAnalyticsService;

    @PostMapping("/{id}/view")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Void> trackPostView(
            @CurrentUser User currentUser,
            @PathVariable Long id,
            HttpServletRequest request) {

        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getRemoteAddr();
        } else {
            clientIp = clientIp.split(",")[0].trim();
        }

        postAnalyticsService.trackPostView(currentUser, id, clientIp);
        return ApiResponse.success(null, "Ghi nhận lượt xem thành công");
    }

    @GetMapping("/{id}/analytics/views")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<PostViewChartResponse>> getPostViewChart(
            @CurrentUser User currentUser,
            @PathVariable Long id,
            @RequestParam(value = "days", defaultValue = "7") @Min(1) Integer days) {

        List<PostViewChartResponse> chartData = postAnalyticsService.getPostViewChartData(currentUser, id, days);
        return ApiResponse.success(chartData, "Lấy dữ liệu biểu đồ thành công");
    }

    @GetMapping("/{id}/analytics/views/monthly")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<PostViewChartResponse>> getMonthlyPostViewChart(
            @CurrentUser User currentUser,
            @PathVariable Long id,
            @RequestParam(value = "months", defaultValue = "6") @Min(1) Integer months) {

        // Mặc định lấy 6 tháng gần nhất nếu Frontend không truyền tham số 'months'
        List<PostViewChartResponse> chartData = postAnalyticsService.getMonthlyPostViewChartData(currentUser, id,
                months);

        return ApiResponse.success(chartData, "Lấy dữ liệu biểu đồ theo tháng thành công");
    }

    @GetMapping("/analytics/price-history")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<PriceHistoryResponse> getPriceHistoryChart(
            @Valid PriceHistoryRequest request) {
        return ApiResponse.success(
                postAnalyticsService.getPriceHistoryData(request),
                "Lấy dữ liệu biểu đồ giá thành công");
    }

    @GetMapping("/analytics/nearby-locations")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<NearbyLocationPriceResponse>> getNearbyLocationsPrice(
            @Valid PriceHistoryRequest request) {
        return ApiResponse.success(
                postAnalyticsService.getNearbyLocationsPrice(request),
                "Lấy dữ liệu giá lân cận thành công");
    }
}