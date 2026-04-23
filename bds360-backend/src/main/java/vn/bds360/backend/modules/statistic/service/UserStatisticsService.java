// --- File: statistic/service/UserStatisticsService.java ---
package vn.bds360.backend.modules.statistic.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
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
import vn.bds360.backend.modules.post.repository.PostViewHistoryRepository;
import vn.bds360.backend.modules.statistic.dto.response.UserDashboardResponse.CashFlow;
import vn.bds360.backend.modules.statistic.dto.response.UserDashboardResponse.KpiSummary;
import vn.bds360.backend.modules.statistic.dto.response.UserDashboardResponse.PostStatusBreakdown;
import vn.bds360.backend.modules.statistic.dto.response.UserDashboardResponse.TopPost;
import vn.bds360.backend.modules.statistic.dto.response.UserDashboardResponse.ViewTrend;
import vn.bds360.backend.modules.transaction.constant.TransactionStatus;
import vn.bds360.backend.modules.transaction.constant.TransactionType;
import vn.bds360.backend.modules.transaction.entity.Transaction;
import vn.bds360.backend.modules.transaction.repository.TransactionRepository;
import vn.bds360.backend.modules.user.entity.User;

@Service
@RequiredArgsConstructor
public class UserStatisticsService {

    private final PostRepository postRepository;
    private final TransactionRepository transactionRepository;
    private final PostViewHistoryRepository postViewHistoryRepository;

    // ==============================================================
    // 1. LẤY 4 CHỈ SỐ KPI TỔNG QUAN
    // ==============================================================
    @Transactional(readOnly = true)
    public KpiSummary getKpiSummary(User user) {
        // Lấy thời điểm đầu tháng này
        Instant startOfMonth = YearMonth.now().atDay(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        // Query tổng chi tiêu tháng này (ra số âm)
        Long rawMonthlySpending = transactionRepository.sumAmountByUserAndTypeAndStatusSince(
                user, TransactionType.PAYMENT, TransactionStatus.SUCCESS, startOfMonth);

        return KpiSummary.builder()
                .availableBalance(user.getBalance() != null ? user.getBalance() : 0L)
                .activePosts(postRepository.countByUserAndStatus(user, PostStatus.APPROVED))
                .totalViews(postRepository.sumTotalViewsByUser(user))
                .monthlySpending(Math.abs(rawMonthlySpending)) // 🌟 Trị tuyệt đối: Biến số âm thành dương
                .build();
    }

    // ==============================================================
    // 2. BIỂU ĐỒ LƯỢT XEM THEO THỜI GIAN
    // ==============================================================
    @Transactional(readOnly = true)
    public List<ViewTrend> getViewsChart(User user, Integer daysAgo) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(daysAgo - 1); // Trừ n-1 để bao gồm cả ngày hiện tại
        Instant startInstant = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();

        // Fetch data từ DB
        List<Object[]> rawData = postViewHistoryRepository.countDailyViewsByPostOwnerNative(user.getId(), startInstant);

        // Chuyển thành Map tra cứu nhanh
        Map<String, Long> viewMap = rawData.stream()
                .collect(Collectors.toMap(
                        row -> row[0].toString(),
                        row -> ((Number) row[1]).longValue()));

        List<ViewTrend> result = new ArrayList<>();

        // Loop lấp đầy các ngày không có view (bằng 0)
        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            String dateStr = current.toString();
            result.add(ViewTrend.builder()
                    .date(dateStr)
                    .views(viewMap.getOrDefault(dateStr, 0L))
                    .build());
            current = current.plusDays(1);
        }

        return result;
    }

    // ==============================================================
    // 3. BIỂU ĐỒ TRẠNG THÁI TIN ĐĂNG (PIE/DONUT CHART)
    // ==============================================================
    @Transactional(readOnly = true)
    public List<PostStatusBreakdown> getPostStatusBreakdown(User user) {
        // Có thể dùng Custom Query GROUP BY ở Repo, hoặc duyệt list (nếu list ngắn).
        // Để an toàn và nhanh nhất, ta group trực tiếp bằng Java Streams.
        // Chú ý: Ở đây ta quy định chỉ lấy các trạng thái thường gặp để biểu đồ không
        // bị rối.

        Map<PostStatus, Long> countMap = user.getPosts().stream()
                .collect(Collectors.groupingBy(Post::getStatus, Collectors.counting()));

        List<PostStatusBreakdown> result = new ArrayList<>();
        for (PostStatus status : PostStatus.values()) {
            Long count = countMap.getOrDefault(status, 0L);
            if (count > 0) { // Chỉ lấy những trạng thái có số lượng > 0
                result.add(PostStatusBreakdown.builder()
                        .status(status)
                        .count(count)
                        .build());
            }
        }
        return result;
    }

    // ==============================================================
    // 4. DANH SÁCH TOP TIN ĐĂNG HIỆU QUẢ NHẤT
    // ==============================================================
    @Transactional(readOnly = true)
    public List<TopPost> getTopPosts(User user, Integer limit) {
        List<Post> topPosts = postRepository.findByUserOrderByViewDesc(user, PageRequest.of(0, limit));

        return topPosts.stream().map(post -> {
            String vipName = post.getVip() != null ? post.getVip().getName() : "Tin thường";

            // Giả lập map màu (nếu bạn không lưu màu trong DB, bạn có thể truyền tên về FE
            // để FE tự map màu)
            // Ở đây tôi trả về vipName, FE sẽ dùng VIP_COLOR_MAP để hiển thị
            return TopPost.builder()
                    .postId(post.getId())
                    .title(post.getTitle())
                    .views(post.getView())
                    .vipName(vipName)
                    .build();
        }).collect(Collectors.toList());
    }

    // ==============================================================
    // 5. BIỂU ĐỒ DÒNG TIỀN THU/CHI THEO THÁNG
    // ==============================================================
    @Transactional(readOnly = true)
    public List<CashFlow> getCashFlowChart(User user, Integer months) {
        YearMonth endMonth = YearMonth.now();
        YearMonth startMonth = endMonth.minusMonths(months - 1);
        Instant startInstant = startMonth.atDay(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        // Lấy tất cả giao dịch thành công trong 'n' tháng qua
        List<Transaction> transactions = transactionRepository.findByUserAndStatusAndCreatedAtGreaterThanEqual(
                user, TransactionStatus.SUCCESS, startInstant);

        // Map nhóm giao dịch theo định dạng YYYY-MM
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        Map<String, List<Transaction>> groupedByMonth = transactions.stream()
                .collect(Collectors.groupingBy(
                        t -> YearMonth.from(t.getCreatedAt().atZone(ZoneId.systemDefault())).format(formatter)));

        List<CashFlow> result = new ArrayList<>();
        YearMonth current = startMonth;

        while (!current.isAfter(endMonth)) {
            String monthStr = current.format(formatter);
            List<Transaction> monthTxns = groupedByMonth.getOrDefault(monthStr, new ArrayList<>());

            // Tính tổng nạp
            long totalDeposit = monthTxns.stream()
                    .filter(t -> t.getType() == TransactionType.DEPOSIT)
                    .mapToLong(Transaction::getAmount)
                    .sum();

            // Tính tổng chi (Amount trong DB đang là âm, ta dùng Math.abs để đổi thành
            // dương)
            long totalPayment = monthTxns.stream()
                    .filter(t -> t.getType() == TransactionType.PAYMENT)
                    .mapToLong(t -> Math.abs(t.getAmount())) // 🌟 Đã xử lý số dương
                    .sum();

            result.add(CashFlow.builder()
                    .month(monthStr)
                    .depositAmount(totalDeposit)
                    .paymentAmount(totalPayment)
                    .build());

            current = current.plusMonths(1);
        }

        return result;
    }
}