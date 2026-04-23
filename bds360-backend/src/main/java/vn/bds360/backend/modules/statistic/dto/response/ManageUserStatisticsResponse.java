package vn.bds360.backend.modules.statistic.dto.response;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ManageUserStatisticsResponse {

    private KpiSummary kpis;
    private List<UserGrowthTrend> growthTrend; // Biểu đồ 1
    private UserBehaviorStats behaviorStats; // Biểu đồ 2
    private UserPrestigeStats prestigeStats; // Biểu đồ 3
    private List<TopAgent> topAgents; // Biểu đồ 4

    // --- Các class con (Sub-classes) ---

    @Getter
    @Setter
    @Builder
    public static class KpiSummary {
        private long totalUsers;
        private long newUsers;
        @Builder.Default // Thêm cái này để Lombok gán giá trị mặc định là 0.0 thay vì lỗi
        private double newUserGrowthPercent = 0.0;
        @Builder.Default
        private double verificationRate = 0.0;
        private long activeUsers;
    }

    public interface UserGrowthTrend {
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate getDate();

        Long getNewUsers();
    }

    @Getter
    @Setter
    @Builder
    public static class UserBehaviorStats {
        private long postersCount; // Người đăng tin
        private long viewersCount; // Chỉ xem
    }

    @Getter
    @Setter
    @Builder
    public static class UserPrestigeStats {
        private long verifiedCount;
        private long unverifiedCount;
    }

    public interface TopAgent {
        Long getUserId();

        String getName();

        String getEmail();

        Long getActivePostCount();
    }
}