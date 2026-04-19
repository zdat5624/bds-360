package vn.bds360.backend.modules.post.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

import lombok.RequiredArgsConstructor;
import vn.bds360.backend.modules.post.dto.response.PostViewChartResponse;
import vn.bds360.backend.modules.post.entity.Post;
import vn.bds360.backend.modules.post.entity.PostViewHistory;
import vn.bds360.backend.modules.post.repository.PostRepository;
import vn.bds360.backend.modules.post.repository.PostViewHistoryRepository;
import vn.bds360.backend.modules.user.entity.User;

@Service
@RequiredArgsConstructor
public class PostAnalyticsService {

    private final PostRepository postRepository;
    private final PostViewHistoryRepository postViewHistoryRepository;

    private final Cache<String, Boolean> viewSpamGuard = Caffeine.newBuilder()
            .expireAfterWrite(30, TimeUnit.MINUTES)
            .maximumSize(10000)
            .build();

    @Transactional
    public void trackPostView(User currentUser, Long postId, String clientIp) {
        Post post = postRepository.findById(postId).orElse(null);
        if (post == null)
            return;

        boolean isOwner = currentUser != null && post.getUser().getId().equals(currentUser.getId());
        String viewerId = (currentUser != null) ? "USER_" + currentUser.getId() : "IP_" + clientIp;
        String cacheKey = postId + "_" + viewerId;

        if (viewSpamGuard.getIfPresent(cacheKey) == null && !isOwner) {
            viewSpamGuard.put(cacheKey, true);

            post.setView(post.getView() + 1);
            postRepository.save(post);

            PostViewHistory history = PostViewHistory.builder()
                    .post(post)
                    .user(currentUser)
                    .ipAddress(clientIp)
                    // prePersist sẽ tự lo gán Instant.now() cho viewedAt
                    .build();
            postViewHistoryRepository.save(history);
        }
    }

    @Transactional(readOnly = true)
    public List<PostViewChartResponse> getPostViewChartData(User currentUser, Long postId, Integer daysAgo) {

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(daysAgo);
        Instant startInstant = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();

        // Lấy data từ DB (bị thiếu các ngày 0 view)
        List<Object[]> rawData = postViewHistoryRepository.countDailyViewsByPostNative(postId, startInstant);

        // Chuyển rawData thành Map<Ngày, Số View> để tra cứu siêu nhanh
        Map<String, Long> viewMap = rawData.stream()
                .collect(Collectors.toMap(
                        row -> row[0].toString(),
                        row -> ((Number) row[1]).longValue()));

        List<PostViewChartResponse> finalResult = new ArrayList<>();

        // Vòng lặp đắp data: Đi từ startDate đến endDate
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            String dateString = currentDate.toString(); // Format: YYYY-MM-DD
            // Lấy view từ Map, nếu không có thì trả về 0
            Long views = viewMap.getOrDefault(dateString, 0L);
            finalResult.add(new PostViewChartResponse(dateString, views));

            currentDate = currentDate.plusDays(1); // Tiến lên 1 ngày
        }

        return finalResult;
    }

    // 2. CẬP NHẬT HÀM THỐNG KÊ THEO THÁNG (Tự điền 0)
    @Transactional(readOnly = true)
    public List<PostViewChartResponse> getMonthlyPostViewChartData(User currentUser, Long postId, Integer monthsAgo) {

        YearMonth endMonth = YearMonth.now();
        YearMonth startMonth = endMonth.minusMonths(monthsAgo);

        // Lấy Instant của ngày mùng 1 tháng bắt đầu
        Instant startInstant = startMonth.atDay(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        // Lấy data từ DB
        List<Object[]> rawData = postViewHistoryRepository.countMonthlyViewsByPostNative(postId, startInstant);

        // Chuyển rawData thành Map<Tháng, Số View>
        Map<String, Long> viewMap = rawData.stream()
                .collect(Collectors.toMap(
                        row -> row[0].toString(),
                        row -> ((Number) row[1]).longValue()));

        List<PostViewChartResponse> finalResult = new ArrayList<>();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("yyyy-MM");

        // Vòng lặp đắp data: Đi từ startMonth đến endMonth
        YearMonth currentMonth = startMonth;
        while (!currentMonth.isAfter(endMonth)) {
            String monthString = currentMonth.format(monthFormatter); // Format: YYYY-MM
            Long views = viewMap.getOrDefault(monthString, 0L);
            finalResult.add(new PostViewChartResponse(monthString, views));

            currentMonth = currentMonth.plusMonths(1); // Tiến lên 1 tháng
        }

        return finalResult;
    }
}