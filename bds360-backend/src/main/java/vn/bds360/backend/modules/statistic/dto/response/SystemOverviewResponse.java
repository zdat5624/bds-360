package vn.bds360.backend.modules.statistic.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.modules.statistic.dto.response.ManagePostStatisticsResponse.PostLogDto;
import vn.bds360.backend.modules.statistic.dto.response.ManageTransactionStatisticsResponse.TopSpender;

@Getter
@Setter
@Builder
public class SystemOverviewResponse {

    private KpiSummary kpis;
    private OperationsBacklog backlog;
    private List<MacroTrend> macroTrends;
    private List<VipDistribution> vipDistributions;
    private List<TopSpender> topSpenders;
    private List<PostLogDto> topPosts;

    @Getter
    @Setter
    @Builder
    public static class KpiSummary {
        @Builder.Default
        private long totalRevenue = 0L;
        @Builder.Default
        private double revenueGrowthPercent = 0.0;
        @Builder.Default
        private long activeUsers = 0L;
        @Builder.Default
        private long activeListings = 0L;
        @Builder.Default
        private double vipConversionRate = 0.0;
    }

    @Getter
    @Setter
    @Builder
    public static class OperationsBacklog {
        @Builder.Default
        private long pendingPosts = 0L;
        @Builder.Default
        private long pendingVerifications = 0L;
        @Builder.Default
        private long pendingDeposits = 0L;
    }

    @Getter
    @Setter
    @Builder
    public static class MacroTrend {
        private String date; // Format: YYYY-MM-DD
        @Builder.Default
        private long revenue = 0L;
        @Builder.Default
        private long newUsers = 0L;
    }

    public interface VipDistribution {
        Integer getVipLevel();

        Long getCount();
    }
}