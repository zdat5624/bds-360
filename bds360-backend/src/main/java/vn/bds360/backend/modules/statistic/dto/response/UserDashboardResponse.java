// --- File: statistic/dto/response/UserDashboardResponse.java ---
package vn.bds360.backend.modules.statistic.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.modules.post.constant.PostStatus;

public class UserDashboardResponse {

    // 1. DTO cho 4 thẻ KPI
    @Getter
    @Setter
    @Builder
    public static class KpiSummary {
        private Long availableBalance;
        private Long activePosts;
        private Long totalViews;
        private Long monthlySpending; // Đã xử lý trị tuyệt đối (Math.abs) từ số âm
    }

    // 2. DTO cho Biểu đồ Lượt xem theo thời gian
    @Getter
    @Setter
    @Builder
    public static class ViewTrend {
        private String date; // Format: YYYY-MM-DD
        private Long views;
    }

    // 3. DTO cho Biểu đồ Cơ cấu trạng thái tin
    @Getter
    @Setter
    @Builder
    public static class PostStatusBreakdown {
        private PostStatus status;
        private Long count;
    }

    // 4. DTO cho Danh sách Top tin đăng
    @Getter
    @Setter
    @Builder
    public static class TopPost {
        private Long postId;
        private String title;
        private Long views;
        private String vipName;
        private String badgeColor; // Trả về màu VIP để FE dễ render
    }

    // 5. DTO cho Biểu đồ Dòng tiền (Thu/Chi)
    @Getter
    @Setter
    @Builder
    public static class CashFlow {
        private String month; // Format: YYYY-MM
        private Long depositAmount; // Tổng nạp (Dương)
        private Long paymentAmount; // Tổng chi (Chuyển số âm thành Dương để biểu đồ dễ vẽ)
    }
}