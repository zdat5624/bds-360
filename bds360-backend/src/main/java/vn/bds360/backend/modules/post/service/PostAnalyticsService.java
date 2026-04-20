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
import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.modules.post.dto.request.PriceHistoryRequest;
import vn.bds360.backend.modules.post.dto.response.NearbyLocationPriceResponse;
import vn.bds360.backend.modules.post.dto.response.PostViewChartResponse;
import vn.bds360.backend.modules.post.dto.response.PriceHistoryResponse;
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

    @Transactional(readOnly = true)
    public PriceHistoryResponse getPriceHistoryData(PriceHistoryRequest request) {
        YearMonth endMonth = YearMonth.now();
        YearMonth startMonth = endMonth.minusMonths(request.getMonths() - 1);
        Instant startInstant = startMonth.atDay(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        // 1. Thử lấy dữ liệu chi tiết nhất có thể
        List<Object[]> rawData = postRepository.findMonthlyPriceStats(
                request.getType(), startInstant, request.getCategoryId(),
                request.getProvinceCode(), request.getDistrictCode(), request.getWardCode());

        String note = null;

        // 2. LOGIC FALLBACK BIỂU ĐỒ
        if (request.getWardCode() != null && rawData.size() < 2) {
            rawData = postRepository.findMonthlyPriceStats(
                    request.getType(), startInstant, request.getCategoryId(),
                    request.getProvinceCode(), request.getDistrictCode(), null); // Bỏ Ward
            note = "Dữ liệu tại khu vực này chưa đủ để thống kê. Biểu đồ đang hiển thị mức giá trung bình của toàn Quận/Huyện.";
        } else if (request.getDistrictCode() != null && rawData.size() < 2) {
            rawData = postRepository.findMonthlyPriceStats(
                    request.getType(), startInstant, request.getCategoryId(),
                    request.getProvinceCode(), null, null); // Bỏ District
            note = "Dữ liệu tại khu vực này chưa đủ để thống kê. Biểu đồ đang hiển thị mức giá trung bình của toàn Tỉnh/Thành phố.";
        }

        // 3. Xử lý làm đầy (Fill) dữ liệu
        Map<String, PriceHistoryResponse.PriceTrend> dataMap = rawData.stream().collect(Collectors.toMap(
                row -> row[0].toString(),
                row -> PriceHistoryResponse.PriceTrend.builder()
                        .month(row[0].toString())
                        .minPrice(((Number) row[1]).doubleValue())
                        .maxPrice(((Number) row[2]).doubleValue())
                        .avgPrice(((Number) row[3]).doubleValue())
                        .build()));

        List<PriceHistoryResponse.PriceTrend> trendList = new ArrayList<>();
        Double peakPrice = 0.0;
        String peakMonth = null;
        Double firstAvailablePrice = null;
        Double currentAvgPrice = null;

        PriceHistoryResponse.PriceTrend lastKnownData = null;
        YearMonth current = startMonth;

        while (!current.isAfter(endMonth)) {
            String monthStr = current.format(DateTimeFormatter.ofPattern("yyyy-MM"));
            PriceHistoryResponse.PriceTrend monthData = dataMap.get(monthStr);

            if (monthData == null) {
                if (lastKnownData != null) {
                    monthData = PriceHistoryResponse.PriceTrend.builder()
                            .month(monthStr)
                            .minPrice(lastKnownData.getMinPrice())
                            .maxPrice(lastKnownData.getMaxPrice())
                            .avgPrice(lastKnownData.getAvgPrice())
                            .build();
                } else {
                    monthData = PriceHistoryResponse.PriceTrend.builder()
                            .month(monthStr).minPrice(0.0).maxPrice(0.0).avgPrice(0.0).build();
                }
            } else {
                lastKnownData = monthData;
            }

            if (monthData.getAvgPrice() > peakPrice) {
                peakPrice = monthData.getAvgPrice();
                peakMonth = monthStr;
            }

            if (firstAvailablePrice == null && monthData.getAvgPrice() > 0) {
                firstAvailablePrice = monthData.getAvgPrice();
            }
            currentAvgPrice = monthData.getAvgPrice();

            trendList.add(monthData);
            current = current.plusMonths(1);
        }

        // 4. Tính % tăng giảm
        Double changePercent = 0.0;
        if (firstAvailablePrice != null && firstAvailablePrice > 0 && currentAvgPrice != null) {
            changePercent = ((currentAvgPrice - firstAvailablePrice) / firstAvailablePrice) * 100;
        }

        Double dropFromPeakPercent = 0.0;
        if (peakPrice > 0 && currentAvgPrice != null) {
            dropFromPeakPercent = ((currentAvgPrice - peakPrice) / peakPrice) * 100;
        }

        PriceHistoryResponse.PriceSummary summary = PriceHistoryResponse.PriceSummary.builder()
                .currentAvgPrice(currentAvgPrice)
                .changePercent(Math.round(changePercent * 10.0) / 10.0)
                .peakPrice(peakPrice)
                .peakMonth(peakMonth)
                .dropFromPeakPercent(Math.round(dropFromPeakPercent * 10.0) / 10.0)
                .build();

        return PriceHistoryResponse.builder()
                .note(note)
                .summary(summary)
                .trend(trendList)
                .build();
    }

    @Transactional(readOnly = true)
    public List<NearbyLocationPriceResponse> getNearbyLocationsPrice(PriceHistoryRequest request) {
        if (request.getDistrictCode() == null || request.getProvinceCode() == null) {
            throw new AppException(ErrorCode.INVALID_ADDRESS_HIERARCHY);
        }

        List<Object[]> rawData = postRepository.findNearbyWardsPriceStats(
                request.getType(), request.getDistrictCode(), request.getCategoryId());

        String locType = "WARD";

        // LOGIC FALLBACK SO SÁNH
        if (rawData.size() < 2) {
            rawData = postRepository.findNearbyDistrictsPriceStats(
                    request.getType(), request.getProvinceCode(), request.getCategoryId());
            locType = "DISTRICT";
        }

        final String finalLocType = locType;

        return rawData.stream().map(row -> new NearbyLocationPriceResponse(
                ((Number) row[0]).longValue(),
                row[1].toString(),
                ((Number) row[2]).doubleValue(),
                ((Number) row[3]).longValue(),
                finalLocType)).collect(Collectors.toList());
    }
}