package vn.bds360.backend.modules.statistics.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.bds360.backend.common.constant.PostStatusEnum;
import vn.bds360.backend.common.constant.TransStatusEnum;
import vn.bds360.backend.modules.post.repository.PostRepository;
import vn.bds360.backend.modules.statistics.dto.response.AdminStatisticsDTO;
import vn.bds360.backend.modules.statistics.dto.response.MonthlyRevenueDTO;
import vn.bds360.backend.modules.transaction.repository.TransactionRepository;
import vn.bds360.backend.modules.user.repository.UserRepository;

@Service
public class AdminStatisticsService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    public AdminStatisticsDTO getStatistics() {
        // Lấy năm và tháng hiện tại
        LocalDate now = LocalDate.now();
        int targetYear = now.getYear();
        int targetMonth = now.getMonthValue();

        AdminStatisticsDTO dto = new AdminStatisticsDTO();

        // 1. Doanh thu năm: Tổng amount của các giao dịch SUCCESS trong năm hiện tại
        Long totalRevenueYear = transactionRepository.sumAmountByYearAndStatus(
                targetYear, TransStatusEnum.SUCCESS);
        dto.setTotalRevenueYear(totalRevenueYear != null ? totalRevenueYear : 0L);

        // 2. Doanh thu tháng: Tổng amount của các giao dịch SUCCESS trong tháng hiện
        // tại
        Long totalRevenueMonth = transactionRepository.sumAmountByYearMonthAndStatus(
                targetYear, targetMonth, TransStatusEnum.SUCCESS);
        dto.setTotalRevenueMonth(totalRevenueMonth != null ? totalRevenueMonth : 0L);

        // 3. Tổng số người dùng
        Long totalUsers = userRepository.count();
        dto.setTotalUsers(totalUsers);

        // 4. Số tin đăng chờ duyệt (PENDING hoặc REVIEW_LATER)
        Long pendingPosts = postRepository.countByStatusIn(
                PostStatusEnum.PENDING, PostStatusEnum.REVIEW_LATER);
        dto.setPendingPosts(pendingPosts);

        return dto;
    }

    public List<MonthlyRevenueDTO> getMonthlyRevenue(Integer year) {
        List<MonthlyRevenueDTO> monthlyRevenues = new ArrayList<>();

        // Lặp qua 12 tháng
        for (int month = 1; month <= 12; month++) {
            // Tính tổng doanh thu cho tháng cụ thể
            Long revenue = transactionRepository.sumAmountByYearMonthAndStatus(
                    year, month, TransStatusEnum.SUCCESS);
            monthlyRevenues.add(new MonthlyRevenueDTO(month, revenue != null ? revenue : 0L));
        }

        return monthlyRevenues;
    }
}