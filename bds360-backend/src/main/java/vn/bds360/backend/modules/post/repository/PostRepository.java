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
import vn.bds360.backend.common.constant.PostStatus;
import vn.bds360.backend.modules.post.entity.Post;
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

        @Query("SELECT " +
                        "p.latitude, " +
                        "p.longitude, " +
                        "p.id as postId, " +
                        "p.vip.id as vipId, " +
                        "p.price " +
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
                        "AND p.status IN ('APPROVED', 'REVIEW_LATER') " +
                        "AND p.latitude IS NOT NULL AND p.longitude IS NOT NULL")
        List<Object[]> findPostsForMap(
                        @Param("minPrice") Long minPrice,
                        @Param("maxPrice") Long maxPrice,
                        @Param("minArea") Double minArea,
                        @Param("maxArea") Double maxArea,
                        @Param("categoryId") Long categoryId,
                        @Param("type") ListingType type,
                        @Param("provinceCode") Long provinceCode,
                        @Param("districtCode") Long districtCode,
                        @Param("wardCode") Long wardCode);

        @Query("SELECT COUNT(p) FROM Post p WHERE p.status IN (:status1, :status2)")
        Long countByStatusIn(PostStatus status1, PostStatus status2);

}
