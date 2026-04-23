package vn.bds360.backend.modules.post.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;
import vn.bds360.backend.common.constant.ListingType;
import vn.bds360.backend.modules.post.constant.PostStatus;
import vn.bds360.backend.modules.post.dto.response.MapPostResponse;
import vn.bds360.backend.modules.post.entity.Post;
import vn.bds360.backend.modules.statistic.dto.response.ManagePostStatisticsResponse.ListingTypeStats;
import vn.bds360.backend.modules.statistic.dto.response.ManagePostStatisticsResponse.PostGrowthTrend;
import vn.bds360.backend.modules.statistic.dto.response.ManagePostStatisticsResponse.ProvinceStats;
import vn.bds360.backend.modules.statistic.dto.response.ManageUserStatisticsResponse;
import vn.bds360.backend.modules.statistic.dto.response.SystemOverviewResponse;
import vn.bds360.backend.modules.user.entity.User;

public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {

        @Modifying
        @Transactional
        @Query("UPDATE Post p SET p.status = :newStatus WHERE p.expireDate < :now")
        int updateExpiredPosts(@Param("newStatus") PostStatus newStatus, @Param("now") Instant now);

        List<Post> findByUser(User user);

        @Query("SELECT p FROM Post p WHERE p.user.email = :userEmail " +
                        "AND (:status IS NULL OR p.status = :status) " +
                        "AND (:type IS NULL OR p.type = :type) " +
                        "AND (p.deletedByUser = false) " +
                        "AND (:provinceCode IS NULL OR p.province.code = :provinceCode) " +
                        "AND (:postId IS NULL OR p.id = :postId)")
        Page<Post> findMyPosts(@Param("userEmail") String userEmail,
                        @Param("status") PostStatus status,
                        @Param("type") ListingType type,
                        @Param("provinceCode") Long provinceCode,
                        @Param("postId") Long postId,
                        Pageable pageable);

        @Query("SELECT COUNT(p) FROM Post p WHERE p.status IN (:status1, :status2)")
        Long countByStatusIn(PostStatus status1, PostStatus status2);

        // 1. Lịch sử giá (Theo tháng)
        @Query(value = "SELECT " +
                        "DATE_FORMAT(p.created_at, '%Y-%m') AS monthStr, " +
                        // 👇 FIX: Thêm logic IF check loại tin ngay trong SQL
                        "MIN(IF(p.type = 'SALE', p.price / NULLIF(p.area, 0), p.price)) AS minPrice, " +
                        "MAX(IF(p.type = 'SALE', p.price / NULLIF(p.area, 0), p.price)) AS maxPrice, " +
                        "AVG(IF(p.type = 'SALE', p.price / NULLIF(p.area, 0), p.price)) AS avgPrice " +
                        "FROM posts p " +
                        "WHERE p.type = :#{#type.name()} " +
                        "AND p.status IN ('APPROVED', 'REVIEW_LATER', 'EXPIRED') " +
                        "AND p.deleted_by_user = false " +
                        "AND p.created_at >= :startDate " +
                        "AND (:categoryId IS NULL OR p.category_id = :categoryId) " +
                        "AND (:provinceCode IS NULL OR p.province_code = :provinceCode) " +
                        "AND (:districtCode IS NULL OR p.district_code = :districtCode) " +
                        "AND (:wardCode IS NULL OR p.ward_code = :wardCode) " +
                        "GROUP BY monthStr " +
                        "ORDER BY monthStr ASC", nativeQuery = true)
        List<Object[]> findMonthlyPriceStats(
                        @Param("type") ListingType type,
                        @Param("startDate") Instant startDate,
                        @Param("categoryId") Long categoryId,
                        @Param("provinceCode") Long provinceCode,
                        @Param("districtCode") Long districtCode,
                        @Param("wardCode") Long wardCode);

        // 2. So sánh lân cận (Cấp Xã): 🌟 Chỉ lấy tin đang ACTIVE
        @Query(value = "SELECT " +
                        "w.code AS locationCode, " +
                        "w.name AS locationName, " +
                        // 👇 FIX: Thêm logic IF check loại tin
                        "AVG(IF(p.type = 'SALE', p.price / NULLIF(p.area, 0), p.price)) AS avgPrice, " +
                        "COUNT(p.id) AS postCount " +
                        "FROM wards w " +
                        "JOIN posts p ON w.code = p.ward_code " +
                        "WHERE p.type = :#{#type.name()} " +
                        "AND w.district_code = :districtCode " +
                        "AND p.status IN ('APPROVED', 'REVIEW_LATER') " +
                        "AND p.deleted_by_user = false " +
                        "AND (:categoryId IS NULL OR p.category_id = :categoryId) " +
                        "GROUP BY w.code, w.name " +
                        "HAVING COUNT(p.id) > 0 " +
                        "ORDER BY postCount DESC", nativeQuery = true)
        List<Object[]> findNearbyWardsPriceStats(
                        @Param("type") ListingType type,
                        @Param("districtCode") Long districtCode,
                        @Param("categoryId") Long categoryId);

        // 3. So sánh lân cận (Cấp Huyện) - Dành cho Fallback
        @Query(value = "SELECT " +
                        "d.code AS locationCode, " +
                        "d.name AS locationName, " +
                        // 👇 FIX: Thêm logic IF check loại tin
                        "AVG(IF(p.type = 'SALE', p.price / NULLIF(p.area, 0), p.price)) AS avgPrice, " +
                        "COUNT(p.id) AS postCount " +
                        "FROM districts d " +
                        "JOIN posts p ON d.code = p.district_code " +
                        "WHERE p.type = :#{#type.name()} " +
                        "AND d.province_code = :provinceCode " +
                        "AND p.status IN ('APPROVED', 'REVIEW_LATER') " +
                        "AND p.deleted_by_user = false " +
                        "AND (:categoryId IS NULL OR p.category_id = :categoryId) " +
                        "GROUP BY d.code, d.name " +
                        "HAVING COUNT(p.id) > 0 " +
                        "ORDER BY postCount DESC", nativeQuery = true)
        List<Object[]> findNearbyDistrictsPriceStats(
                        @Param("type") ListingType type,
                        @Param("provinceCode") Long provinceCode,
                        @Param("categoryId") Long categoryId);

        @Query("SELECT new vn.bds360.backend.modules.post.dto.response.MapPostResponse(" +
                        "p.latitude, p.longitude, p.id, p.vip.id, p.price) " +
                        "FROM Post p " +
                        "WHERE (:minPrice IS NULL OR p.price >= :minPrice) " +
                        "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
                        "AND (:minArea IS NULL OR p.area >= :minArea) " +
                        "AND (:maxArea IS NULL OR p.area <= :maxArea) " +
                        "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
                        "AND (:type IS NULL OR p.type = :type) " +
                        "AND (:provinceCode IS NULL OR p.province.code = :provinceCode) " +
                        "AND (:districtCode IS NULL OR p.district.code = :districtCode) " +
                        "AND (:wardCode IS NULL OR p.ward.code = :wardCode) " +
                        "AND p.status IN (vn.bds360.backend.modules.post.constant.PostStatus.APPROVED, vn.bds360.backend.modules.post.constant.PostStatus.REVIEW_LATER) "
                        +
                        "AND p.deletedByUser = false " +
                        "AND p.latitude IS NOT NULL AND p.longitude IS NOT NULL")
        List<MapPostResponse> findPostsForMap(
                        @Param("minPrice") Long minPrice,
                        @Param("maxPrice") Long maxPrice,
                        @Param("minArea") Double minArea,
                        @Param("maxArea") Double maxArea,
                        @Param("categoryId") Long categoryId,
                        @Param("type") ListingType type,
                        @Param("provinceCode") Long provinceCode,
                        @Param("districtCode") Long districtCode,
                        @Param("wardCode") Long wardCode);

        // Đếm số lượng tin theo trạng thái
        Long countByUserAndStatus(User user, PostStatus status);

        // Tính tổng view của tất cả các tin thuộc sở hữu của User
        @Query("SELECT COALESCE(SUM(p.view), 0) FROM Post p WHERE p.user = :user")
        Long sumTotalViewsByUser(User user);

        // Lấy top tin đăng hiệu quả nhất
        List<Post> findByUserOrderByViewDesc(User user, Pageable pageable);

        // 1. Số lượng "Người dùng đang hoạt động" (Có tin đăng APPROVED hoặc
        // REVIEW_LATER)
        @Query("SELECT COUNT(DISTINCT p.user.id) FROM Post p WHERE p.status IN (:statuses)")
        long countActiveUsersByPostStatuses(@Param("statuses") List<PostStatus> statuses);

        // 2. Top 10 Đại lý (User có nhiều bài đăng APPROVED/REVIEW_LATER nhất)
        @Query("SELECT u.id as userId, u.name as name, u.email as email, COUNT(p.id) as activePostCount " +
                        "FROM User u JOIN u.posts p " +
                        "WHERE p.status IN (:statuses) " +
                        "GROUP BY u.id, u.name, u.email " +
                        "ORDER BY activePostCount DESC")
        List<ManageUserStatisticsResponse.TopAgent> getTopAgentsByActivePosts(
                        @Param("statuses") List<PostStatus> statuses,
                        Pageable pageable); // Dùng Pageable để limit 10

        // Đếm tổng số tin theo danh sách trạng thái
        long countByStatusIn(List<PostStatus> statuses);

        // Đếm số tin theo trạng thái và cấp độ VIP lớn hơn một mức nhất định
        long countByStatusInAndVip_VipLevelGreaterThan(List<PostStatus> statuses, int vipLevel);

        // Đếm số tin mới tạo trong một khoảng thời gian
        long countByCreatedAtBetween(Instant start, Instant end);

        // Biểu đồ: Xu hướng nguồn cung theo ngày
        @Query(value = "SELECT DATE(created_at) as date, COUNT(id) as count " +
                        "FROM posts " +
                        "WHERE created_at BETWEEN :start AND :end " +
                        "GROUP BY DATE(created_at) ORDER BY date ASC", nativeQuery = true)
        List<PostGrowthTrend> getSupplyTrend(@Param("start") Instant start, @Param("end") Instant end);

        // Biểu đồ: Cơ cấu nhu cầu (Nhóm theo ListingType của Category) đối với tin đang
        // hiển thị
        @Query("SELECT p.category.type as type, COUNT(p) as count FROM Post p WHERE p.status IN :statuses GROUP BY p.category.type")
        List<ListingTypeStats> getDemandStructure(@Param("statuses") List<PostStatus> statuses);

        // Biểu đồ: Top tỉnh thành có lượng tin hiển thị lớn nhất
        @Query("SELECT p.province.name as name, COUNT(p) as count FROM Post p WHERE p.status IN :statuses GROUP BY p.province.name ORDER BY count DESC")
        List<ProvinceStats> getTopActiveProvinces(@Param("statuses") List<PostStatus> statuses, Pageable pageable);

        // Bảng 1: Top tin đăng có lượt xem cao nhất trong kỳ
        List<Post> findTop5ByCreatedAtBetweenOrderByViewDesc(Instant start, Instant end);

        // Bảng 2: Top tin VIP mới nhất
        List<Post> findTop5ByVip_VipLevelGreaterThanOrderByCreatedAtDesc(int vipLevel);

        // Lấy cơ cấu tin đăng đang hiển thị theo cấp độ VIP
        @Query("SELECT p.vip.vipLevel as vipLevel, COUNT(p.id) as count " +
                        "FROM Post p WHERE p.status IN :statuses GROUP BY p.vip.vipLevel ORDER BY p.vip.vipLevel ASC")
        List<SystemOverviewResponse.VipDistribution> getActivePostsVipDistribution(
                        @Param("statuses") List<PostStatus> statuses);

}
