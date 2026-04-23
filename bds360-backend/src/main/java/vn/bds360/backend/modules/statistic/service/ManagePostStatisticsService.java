package vn.bds360.backend.modules.statistic.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.bds360.backend.modules.post.constant.PostStatus;
import vn.bds360.backend.modules.post.entity.Post;
import vn.bds360.backend.modules.post.repository.PostRepository;
import vn.bds360.backend.modules.statistic.dto.response.ManagePostStatisticsResponse;
import vn.bds360.backend.modules.statistic.dto.response.ManagePostStatisticsResponse.KpiSummary;
import vn.bds360.backend.modules.statistic.dto.response.ManagePostStatisticsResponse.PostLogDto;
import vn.bds360.backend.modules.statistic.mapper.PostStatisticMapper;

@Service
@RequiredArgsConstructor
public class ManagePostStatisticsService {

    private final PostRepository postRepository;
    private final PostStatisticMapper postMapper;

    @Transactional(readOnly = true)
    public ManagePostStatisticsResponse getPostDashboard(int days) {
        Instant endDate = Instant.now();
        Instant startDate = endDate.minus(days, ChronoUnit.DAYS);

        Instant prevEndDate = startDate;
        Instant prevStartDate = prevEndDate.minus(days, ChronoUnit.DAYS);

        List<PostStatus> activeStatuses = Arrays.asList(PostStatus.APPROVED, PostStatus.REVIEW_LATER);
        List<PostStatus> backlogStatuses = Arrays.asList(PostStatus.PENDING, PostStatus.REVIEW_LATER);

        // 1. KPI: Đang hiển thị
        long activeListings = postRepository.countByStatusIn(activeStatuses);

        // 2. KPI: Tin đăng mới & Tăng trưởng
        long newPosts = postRepository.countByCreatedAtBetween(startDate, endDate);
        long prevNewPosts = postRepository.countByCreatedAtBetween(prevStartDate, prevEndDate);
        double newPostsGrowth = calculateGrowth(newPosts, prevNewPosts);

        // 3. KPI: Cần xử lý (Backlog)
        long moderationBacklog = postRepository.countByStatusIn(backlogStatuses);

        // 4. KPI: Tỷ lệ tin VIP
        long vipListings = postRepository.countByStatusInAndVip_VipLevelGreaterThan(activeStatuses, 0);
        double vipRatio = activeListings > 0 ? ((double) vipListings / activeListings) * 100 : 0.0;

        KpiSummary kpis = KpiSummary.builder()
                .activeListings(activeListings)
                .newPosts(newPosts)
                .newPostsGrowthPercent(Math.round(newPostsGrowth * 10.0) / 10.0)
                .moderationBacklog(moderationBacklog)
                .vipRatio(Math.round(vipRatio * 10.0) / 10.0)
                .build();

        // Data Tables
        List<Post> topViewedEntities = postRepository.findTop5ByCreatedAtBetweenOrderByViewDesc(startDate, endDate);
        List<Post> latestVipEntities = postRepository.findTop5ByVip_VipLevelGreaterThanOrderByCreatedAtDesc(0);

        return ManagePostStatisticsResponse.builder()
                .kpis(kpis)
                .supplyTrend(postRepository.getSupplyTrend(startDate, endDate))
                .demandStructure(postRepository.getDemandStructure(activeStatuses))
                .topProvinces(postRepository.getTopActiveProvinces(activeStatuses, PageRequest.of(0, 10)))
                .topViewedPosts(mapToLogDto(topViewedEntities))
                .latestVipPosts(mapToLogDto(latestVipEntities))
                .build();
    }

    private double calculateGrowth(long current, long previous) {
        if (previous > 0) {
            return ((double) (current - previous) / previous) * 100;
        } else if (current > 0) {
            return 100.0;
        }
        return 0.0;
    }

    private List<PostLogDto> mapToLogDto(List<Post> posts) {
        return posts.stream()
                .map(postMapper::toPostLogDto)
                .collect(Collectors.toList());
    }
}