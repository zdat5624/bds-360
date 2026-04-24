// vn/bds360/backend/modules/post/specification/ForYouSpecification.java
package vn.bds360.backend.modules.post.specification;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.bds360.backend.common.constant.ListingType;
import vn.bds360.backend.modules.post.constant.PostStatus;
import vn.bds360.backend.modules.post.entity.Post;

public class ForYouSpecification {

    /**
     * TIER 1: Truy vấn bài đăng dựa trên sở thích (Cùng Danh mục HOẶC Cùng Tỉnh)
     */
    public static Specification<Post> buildTier1Spec(
            Long userId,
            List<Long> prefCategoryIds,
            List<Long> prefProvinceCodes,
            List<Long> excludes,
            ListingType type) { // 🌟 Nhận type

        return (root, query, cb) -> {
            Predicate p = cb.conjunction();

            // 1. Điều kiện bắt buộc
            p = cb.and(p, root.get("status").in(PostStatus.APPROVED, PostStatus.REVIEW_LATER));
            p = cb.and(p, cb.equal(root.get("deletedByUser"), false));
            p = cb.and(p, cb.equal(root.get("isHidden"), false));
            p = cb.and(p, cb.notEqual(root.get("user").get("id"), userId));

            if (!excludes.isEmpty()) {
                p = cb.and(p, cb.not(root.get("id").in(excludes)));
            }

            // 🌟 Lọc theo Type nếu có
            if (type != null) {
                p = cb.and(p, cb.equal(root.get("type"), type));
            }

            // 2. Điều kiện linh hoạt (OR: Trùng Tỉnh HOẶC trùng Danh mục)
            Predicate prefPredicate = cb.disjunction();
            if (!prefCategoryIds.isEmpty()) {
                prefPredicate = cb.or(prefPredicate, root.get("category").get("id").in(prefCategoryIds));
            }
            if (!prefProvinceCodes.isEmpty()) {
                prefPredicate = cb.or(prefPredicate, root.get("province").get("code").in(prefProvinceCodes));
            }

            return cb.and(p, prefPredicate);
        };
    }

    /**
     * TIER 2: Vét đáy (Fallback)
     */
    public static Specification<Post> buildTier2Spec(Long userId, List<Long> excludes, ListingType type) { // 🌟 Nhận
                                                                                                           // type
        return (root, query, cb) -> {
            Predicate p = cb.conjunction();

            // 1. Điều kiện bắt buộc
            p = cb.and(p, root.get("status").in(PostStatus.APPROVED, PostStatus.REVIEW_LATER));
            p = cb.and(p, cb.equal(root.get("deletedByUser"), false));
            p = cb.and(p, cb.equal(root.get("isHidden"), false));

            if (userId != null) {
                p = cb.and(p, cb.notEqual(root.get("user").get("id"), userId));
            }
            if (!excludes.isEmpty()) {
                p = cb.and(p, cb.not(root.get("id").in(excludes)));
            }

            // 🌟 Lọc theo Type nếu có
            if (type != null) {
                p = cb.and(p, cb.equal(root.get("type"), type));
            }

            return p;
        };
    }
}