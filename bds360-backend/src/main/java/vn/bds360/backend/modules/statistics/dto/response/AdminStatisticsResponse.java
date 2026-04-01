package vn.bds360.backend.modules.statistics.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatisticsResponse {
    private Long totalRevenueYear; // Doanh thu năm
    private Long totalRevenueMonth; // Doanh thu tháng
    private Long totalUsers; // Tổng số người dùng
    private Long pendingPosts; // Số tin đăng chờ duyệt (PENDING hoặc REVIEW_LATER)
}
