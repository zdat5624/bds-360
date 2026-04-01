package vn.bds360.backend.modules.statistics.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.constant.PostStatusEnum;
import vn.bds360.backend.common.constant.TransStatusEnum;
import vn.bds360.backend.modules.post.repository.PostRepository;
import vn.bds360.backend.modules.statistics.dto.response.AdminStatisticsResponse;
import vn.bds360.backend.modules.statistics.dto.response.MonthlyRevenueResponse;
import vn.bds360.backend.modules.transaction.repository.TransactionRepository;
import vn.bds360.backend.modules.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AdminStatisticsService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public AdminStatisticsResponse getStatistics() {
        LocalDate now = LocalDate.now();
        int targetYear = now.getYear();
        int targetMonth = now.getMonthValue();

        Long totalRevenueYear = transactionRepository.sumAmountByYearAndStatus(targetYear, TransStatusEnum.SUCCESS);
        Long totalRevenueMonth = transactionRepository.sumAmountByYearMonthAndStatus(targetYear, targetMonth,
                TransStatusEnum.SUCCESS);

        return AdminStatisticsResponse.builder()
                .totalRevenueYear(totalRevenueYear != null ? totalRevenueYear : 0L)
                .totalRevenueMonth(totalRevenueMonth != null ? totalRevenueMonth : 0L)
                .totalUsers(userRepository.count())
                .pendingPosts(postRepository.countByStatusIn(PostStatusEnum.PENDING, PostStatusEnum.REVIEW_LATER))
                .build();
    }

    public List<MonthlyRevenueResponse> getMonthlyRevenue(Integer year) {
        // Thay thế vòng lặp for cồng kềnh bằng IntStream
        return IntStream.rangeClosed(1, 12)
                .mapToObj(month -> {
                    Long revenue = transactionRepository.sumAmountByYearMonthAndStatus(year, month,
                            TransStatusEnum.SUCCESS);
                    return new MonthlyRevenueResponse(month, revenue != null ? revenue : 0L);
                })
                .collect(Collectors.toList());
    }
}