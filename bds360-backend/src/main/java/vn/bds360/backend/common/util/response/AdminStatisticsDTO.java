package vn.bds360.backend.common.util.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminStatisticsDTO {
    private Long totalRevenueYear; // Doanh thu năm
    private Long totalRevenueMonth; // Doanh thu tháng
    private Long totalUsers; // Tổng số người dùng
    private Long pendingPosts; // Số tin đăng chờ duyệt (PENDING hoặc REVIEW_LATER)
}
