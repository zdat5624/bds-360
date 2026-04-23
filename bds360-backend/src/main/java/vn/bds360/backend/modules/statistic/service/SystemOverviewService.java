package vn.bds360.backend.modules.statistic.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.bds360.backend.modules.post.constant.PostStatus;
import vn.bds360.backend.modules.post.entity.Post;
import vn.bds360.backend.modules.post.repository.PostRepository;
import vn.bds360.backend.modules.statistic.dto.response.DailyStatProjection;
import vn.bds360.backend.modules.statistic.dto.response.ManagePostStatisticsResponse.PostLogDto;
import vn.bds360.backend.modules.statistic.dto.response.ManageTransactionStatisticsResponse.TopSpender;
import vn.bds360.backend.modules.statistic.dto.response.SystemOverviewResponse;
import vn.bds360.backend.modules.statistic.dto.response.SystemOverviewResponse.KpiSummary;
import vn.bds360.backend.modules.statistic.dto.response.SystemOverviewResponse.MacroTrend;
import vn.bds360.backend.modules.statistic.dto.response.SystemOverviewResponse.OperationsBacklog;
import vn.bds360.backend.modules.statistic.mapper.PostStatisticMapper;
import vn.bds360.backend.modules.transaction.repository.TransactionRepository;
import vn.bds360.backend.modules.user.constant.VerificationStatus;
import vn.bds360.backend.modules.user.repository.UserRepository;
import vn.bds360.backend.modules.user.repository.VerificationSubmissionRepository;

@Service
@RequiredArgsConstructor
public class SystemOverviewService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final VerificationSubmissionRepository verificationRepository;
    private final PostStatisticMapper postMapper;

    @Transactional(readOnly = true)
    public SystemOverviewResponse getSystemOverview(int days) {
        Instant endDate = Instant.now();
        Instant startDate = endDate.minus(days, ChronoUnit.DAYS);
        Instant prevStartDate = startDate.minus(days, ChronoUnit.DAYS);

        List<PostStatus> activeStatuses = Arrays.asList(PostStatus.APPROVED, PostStatus.REVIEW_LATER);
        List<PostStatus> backlogStatuses = Arrays.asList(PostStatus.PENDING, PostStatus.REVIEW_LATER);

        // --- 1. KPI SUMMARY ---
        Long revenueObj = transactionRepository.sumRevenueBetween(startDate, endDate);
        long currentRevenue = revenueObj != null ? revenueObj : 0L;

        Long prevRevenueObj = transactionRepository.sumRevenueBetween(prevStartDate, startDate);
        long prevRevenue = prevRevenueObj != null ? prevRevenueObj : 0L;

        double revenueGrowth = 0.0;
        if (prevRevenue > 0)
            revenueGrowth = ((double) (currentRevenue - prevRevenue) / prevRevenue) * 100;
        else if (currentRevenue > 0)
            revenueGrowth = 100.0;

        long activeUsers = postRepository.countActiveUsersByPostStatuses(activeStatuses);
        long activeListings = postRepository.countByStatusIn(activeStatuses);
        long vipListings = postRepository.countByStatusInAndVip_VipLevelGreaterThan(activeStatuses, 0);

        double vipConversion = activeListings > 0 ? ((double) vipListings / activeListings) * 100 : 0.0;

        KpiSummary kpis = KpiSummary.builder()
                .totalRevenue(currentRevenue)
                .revenueGrowthPercent(Math.round(revenueGrowth * 10.0) / 10.0)
                .activeUsers(activeUsers)
                .activeListings(activeListings)
                .vipConversionRate(Math.round(vipConversion * 10.0) / 10.0)
                .build();

        // --- 2. OPERATIONS BACKLOG ---
        OperationsBacklog backlog = OperationsBacklog.builder()
                .pendingPosts(postRepository.countByStatusIn(backlogStatuses))
                .pendingVerifications(verificationRepository.countByStatus(VerificationStatus.PENDING))
                .pendingDeposits(transactionRepository.countPendingOrFailedDeposits())
                .build();

        // --- 3. MACRO TRENDS (Gộp Doanh thu và User mới theo ngày) ---
        List<DailyStatProjection> revenueData = transactionRepository.getDailyRevenue(startDate, endDate);
        List<DailyStatProjection> newUserData = userRepository.getDailyNewUsers(startDate, endDate);

        Map<String, Long> revenueMap = revenueData.stream()
                .collect(Collectors.toMap(DailyStatProjection::getDate, DailyStatProjection::getValue));
        Map<String, Long> userMap = newUserData.stream()
                .collect(Collectors.toMap(DailyStatProjection::getDate, DailyStatProjection::getValue));

        List<MacroTrend> macroTrends = new ArrayList<>();
        LocalDate current = startDate.atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate end = endDate.atZone(ZoneId.systemDefault()).toLocalDate();

        while (!current.isAfter(end)) {
            String dateStr = current.toString();
            macroTrends.add(MacroTrend.builder()
                    .date(dateStr)
                    .revenue(revenueMap.getOrDefault(dateStr, 0L))
                    .newUsers(userMap.getOrDefault(dateStr, 0L))
                    .build());
            current = current.plusDays(1);
        }

        // --- 4. DANH SÁCH LEADERBOARDS ---
        List<TopSpender> topSpenders = transactionRepository.getTopSpenders(startDate, endDate, PageRequest.of(0, 5));
        List<Post> topPostEntities = postRepository.findTop5ByCreatedAtBetweenOrderByViewDesc(startDate, endDate);

        List<PostLogDto> topPosts = topPostEntities.stream()
                .map(postMapper::toPostLogDto)
                .collect(Collectors.toList());

        return SystemOverviewResponse.builder()
                .kpis(kpis)
                .backlog(backlog)
                .macroTrends(macroTrends)
                .vipDistributions(postRepository.getActivePostsVipDistribution(activeStatuses))
                .topSpenders(topSpenders)
                .topPosts(topPosts)
                .build();
    }
}