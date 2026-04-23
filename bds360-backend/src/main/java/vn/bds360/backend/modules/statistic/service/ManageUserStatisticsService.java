package vn.bds360.backend.modules.statistic.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.constant.Role;
import vn.bds360.backend.modules.post.constant.PostStatus;
import vn.bds360.backend.modules.post.repository.PostRepository;
import vn.bds360.backend.modules.statistic.dto.response.ManageUserStatisticsResponse;
import vn.bds360.backend.modules.statistic.dto.response.ManageUserStatisticsResponse.KpiSummary;
import vn.bds360.backend.modules.statistic.dto.response.ManageUserStatisticsResponse.TopAgent;
import vn.bds360.backend.modules.statistic.dto.response.ManageUserStatisticsResponse.UserBehaviorStats;
import vn.bds360.backend.modules.statistic.dto.response.ManageUserStatisticsResponse.UserGrowthTrend;
import vn.bds360.backend.modules.statistic.dto.response.ManageUserStatisticsResponse.UserPrestigeStats;
import vn.bds360.backend.modules.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class ManageUserStatisticsService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public ManageUserStatisticsResponse getDashboardStatistics(int days) {
        Instant endDate = Instant.now();
        Instant startDate = endDate.minus(days, ChronoUnit.DAYS);

        // Tính khoảng thời gian kỳ trước để so sánh %
        Instant prevEndDate = startDate;
        Instant prevStartDate = prevEndDate.minus(days, ChronoUnit.DAYS);

        // --- 1. Xử lý KPI Cards ---
        long totalUsers = userRepository.count();
        long newUsers = userRepository.countByCreatedAtBetween(startDate, endDate);
        long prevNewUsers = userRepository.countByCreatedAtBetween(prevStartDate, prevEndDate);

        double growthPercent = 0.0;
        if (prevNewUsers > 0) {
            growthPercent = ((double) (newUsers - prevNewUsers) / prevNewUsers) * 100;
        } else if (newUsers > 0) {
            growthPercent = 100.0;
        }

        // Tính tỷ lệ xác thực (Chỉ Role USER)
        long verifiedUsers = userRepository.countByRoleAndIsVerified(Role.USER, true);
        long unverifiedUsers = userRepository.countByRoleAndIsVerified(Role.USER, false);
        long totalNormalUsers = verifiedUsers + unverifiedUsers;
        double verificationRate = totalNormalUsers > 0 ? ((double) verifiedUsers / totalNormalUsers) * 100 : 0.0;

        // Trạng thái tính là "Hoạt động"
        List<PostStatus> activeStatuses = Arrays.asList(PostStatus.APPROVED, PostStatus.REVIEW_LATER);
        long activeUsers = postRepository.countActiveUsersByPostStatuses(activeStatuses);

        KpiSummary kpis = KpiSummary.builder()
                .totalUsers(totalUsers)
                .newUsers(newUsers)
                .newUserGrowthPercent(Math.round(growthPercent * 10.0) / 10.0) // Làm tròn 1 chữ số thập phân
                .verificationRate(Math.round(verificationRate * 10.0) / 10.0)
                .activeUsers(activeUsers)
                .build();

        // --- 2. Xử lý Charts ---
        List<UserGrowthTrend> growthTrend = userRepository.countUserGrowthByDateNative(startDate, endDate);

        long postersCount = userRepository.countUsersWithAtLeastOnePost();
        long viewersCount = totalUsers - postersCount;
        UserBehaviorStats behaviorStats = UserBehaviorStats.builder()
                .postersCount(postersCount)
                .viewersCount(viewersCount > 0 ? viewersCount : 0)
                .build();

        UserPrestigeStats prestigeStats = UserPrestigeStats.builder()
                .verifiedCount(verifiedUsers)
                .unverifiedCount(unverifiedUsers)
                .build();

        List<TopAgent> topAgents = postRepository.getTopAgentsByActivePosts(activeStatuses, PageRequest.of(0, 10));

        // --- 3. Đóng gói ---
        return ManageUserStatisticsResponse.builder()
                .kpis(kpis)
                .growthTrend(growthTrend)
                .behaviorStats(behaviorStats)
                .prestigeStats(prestigeStats)
                .topAgents(topAgents)
                .build();
    }
}
