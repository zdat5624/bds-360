package vn.bds360.backend.modules.user.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.bds360.backend.common.constant.Role;
import vn.bds360.backend.modules.statistic.dto.response.DailyStatProjection;
import vn.bds360.backend.modules.statistic.dto.response.ManageUserStatisticsResponse;
import vn.bds360.backend.modules.user.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
        Optional<User> findByEmail(String email);

        boolean existsByEmail(String email);

        // 1. Đếm user mới trong khoảng thời gian
        long countByCreatedAtBetween(Instant startDate, Instant endDate);

        // 2. Đếm user đã xác thực / chưa xác thực (Chỉ lấy Role = USER)
        long countByRoleAndIsVerified(Role role, Boolean isVerified);

        // 3. Biểu đồ xu hướng tăng trưởng (Native Query cho MySQL)
        @Query(value = "SELECT DATE(created_at) as date, COUNT(id) as newUsers " +
                        "FROM users " +
                        "WHERE created_at BETWEEN :startDate AND :endDate " +
                        "GROUP BY DATE(created_at) ORDER BY date ASC", nativeQuery = true)
        List<ManageUserStatisticsResponse.UserGrowthTrend> countUserGrowthByDateNative(Instant startDate,
                        Instant endDate);

        // 4. Tìm số lượng "Người đăng tin" vs "Tài khoản chỉ xem"
        // Người đăng tin: User có ít nhất 1 bài viết (bất kể trạng thái)
        @Query("SELECT COUNT(DISTINCT p.user.id) FROM Post p")
        long countUsersWithAtLeastOnePost();

        @Query("SELECT SUM(u.balance) FROM User u")
        Long sumTotalSystemBalance();

        // Lấy số lượng người dùng mới theo từng ngày
        @Query(value = "SELECT CAST(DATE(created_at) AS CHAR) as date, COUNT(id) as value " +
                        "FROM users " +
                        "WHERE created_at BETWEEN :start AND :end " +
                        "GROUP BY CAST(DATE(created_at) AS CHAR) " +
                        "ORDER BY CAST(DATE(created_at) AS CHAR) ASC", nativeQuery = true)
        List<DailyStatProjection> getDailyNewUsers(@Param("start") Instant start, @Param("end") Instant end);
}
