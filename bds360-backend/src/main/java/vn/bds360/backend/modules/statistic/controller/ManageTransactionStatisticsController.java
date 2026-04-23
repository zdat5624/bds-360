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
import vn.bds360.backend.modules.statistic.dto.response.ManageTransactionStatisticsResponse;
import vn.bds360.backend.modules.statistic.service.ManageTransactionStatisticsService;
import vn.bds360.backend.security.annotation.IsAdminOrModerator;

@RestController
@RequestMapping("/api/v1/manage/statistics/transactions")
@RequiredArgsConstructor
@ApiGlobalResponse
@Tag(name = "manage-transaction-statistics", description = "Quản trị viên - Thống kê giao dịch và dòng tiền")
public class ManageTransactionStatisticsController {

    private final ManageTransactionStatisticsService transactionStatisticsService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @IsAdminOrModerator
    @Operation(summary = "Lấy dữ liệu Dashboard thống kê dòng tiền (Nạp/Tiêu/Dư nợ)")
    public ApiResponse<ManageTransactionStatisticsResponse> getTransactionDashboardStats(
            @RequestParam(defaultValue = "30") Integer days) {

        return ApiResponse.success(
                transactionStatisticsService.getTransactionDashboard(days),
                "Lấy dữ liệu thống kê giao dịch thành công");
    }
}