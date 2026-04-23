package vn.bds360.backend.modules.statistic.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.ListingType;

@Getter
@Setter
@Builder
public class ManagePostStatisticsResponse {

    private KpiSummary kpis;
    private List<PostGrowthTrend> supplyTrend;
    private List<ListingTypeStats> demandStructure;
    private List<ProvinceStats> topProvinces;
    private List<PostLogDto> topViewedPosts;
    private List<PostLogDto> latestVipPosts;

    @Getter
    @Setter
    @Builder
    public static class KpiSummary {
        private long activeListings;
        private long newPosts;
        private double newPostsGrowthPercent;
        private long moderationBacklog;
        private double vipRatio;
    }

    public interface PostGrowthTrend {
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate getDate();

        Long getCount();
    }

    public interface ListingTypeStats {
        ListingType getType();

        Long getCount();
    }

    public interface ProvinceStats {
        String getName();

        Long getCount();
    }

    @Getter
    @Setter
    @Builder
    public static class PostLogDto {
        private Long id;
        private String title;
        private Long views;
        private ListingType listingType;
        private String userName;
        private String userAvatar;

        private Integer vipLevel;
        private Instant createdAt;
    }
}