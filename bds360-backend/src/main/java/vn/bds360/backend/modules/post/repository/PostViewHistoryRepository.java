package vn.bds360.backend.modules.post.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.bds360.backend.modules.post.entity.PostViewHistory;
import vn.bds360.backend.modules.user.entity.User;

@Repository
public interface PostViewHistoryRepository extends JpaRepository<PostViewHistory, Long> {

        // Ép kiểu viewed_at về DATE để group by
        @Query(value = "SELECT DATE(viewed_at) as view_date, COUNT(*) as views " +
                        "FROM post_view_histories " +
                        "WHERE post_id = :postId AND viewed_at >= :startInstant " +
                        "GROUP BY DATE(viewed_at) " +
                        "ORDER BY view_date ASC", nativeQuery = true)
        List<Object[]> countDailyViewsByPostNative(
                        @Param("postId") Long postId,
                        @Param("startInstant") Instant startInstant);

        @Query(value = "SELECT DATE_FORMAT(viewed_at, '%Y-%m') as view_month, COUNT(*) as views " +
                        "FROM post_view_histories " +
                        "WHERE post_id = :postId AND viewed_at >= :startInstant " +
                        "GROUP BY DATE_FORMAT(viewed_at, '%Y-%m') " +
                        "ORDER BY view_month ASC", nativeQuery = true)
        List<Object[]> countMonthlyViewsByPostNative(
                        @Param("postId") Long postId,
                        @Param("startInstant") Instant startInstant);

        @Query("SELECT pvh FROM PostViewHistory pvh JOIN FETCH pvh.post WHERE pvh.user = :user ORDER BY pvh.viewedAt DESC LIMIT 10")
        List<PostViewHistory> findRecentHistoryByUser(@Param("user") User user);

        // Gom nhóm view theo ngày của TẤT CẢ bài đăng thuộc về 1 User
        // Gom nhóm view theo ngày của TẤT CẢ bài đăng thuộc về 1 User
        @Query(value = "SELECT DATE(vh.viewed_at) as viewDate, COUNT(vh.id) as viewCount " + // 🌟 Đổi created_at ->
                                                                                             // viewed_at
                        "FROM post_view_histories vh " +
                        "JOIN posts p ON vh.post_id = p.id " +
                        "WHERE p.user_id = :userId AND vh.viewed_at >= :startDate " + // 🌟 Đổi created_at -> viewed_at
                        "GROUP BY DATE(vh.viewed_at)", nativeQuery = true) // 🌟 Đổi created_at -> viewed_at
        List<Object[]> countDailyViewsByPostOwnerNative(Long userId, Instant startDate);
}