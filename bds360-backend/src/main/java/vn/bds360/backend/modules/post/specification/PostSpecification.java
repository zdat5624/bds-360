package vn.bds360.backend.modules.post.specification;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import vn.bds360.backend.modules.post.constant.PostStatus;
import vn.bds360.backend.modules.post.dto.request.PostFilterRequest;
import vn.bds360.backend.modules.post.entity.ListingDetail;
import vn.bds360.backend.modules.post.entity.Post;
import vn.bds360.backend.modules.user.entity.User;

public class PostSpecification {

	public static Specification<Post> filterBy(PostFilterRequest filter) {
		return (root, query, cb) -> {
			Predicate predicate = cb.conjunction();

			// --- LỌC BẢNG CHÍNH (POST) ---
			if (filter.getMinPrice() != null)
				predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("price"), filter.getMinPrice()));
			if (filter.getMaxPrice() != null)
				predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("price"), filter.getMaxPrice()));
			if (filter.getMinArea() != null)
				predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("area"), filter.getMinArea()));
			if (filter.getMaxArea() != null)
				predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("area"), filter.getMaxArea()));
			if (filter.getStatus() != null)
				predicate = cb.and(predicate, cb.equal(root.get("status"), filter.getStatus()));
			if (filter.getCategoryId() != null)
				predicate = cb.and(predicate, cb.equal(root.get("category").get("id"), filter.getCategoryId()));
			if (filter.getType() != null)
				predicate = cb.and(predicate, cb.equal(root.get("type"), filter.getType()));
			if (filter.getProvinceCode() != null)
				predicate = cb.and(predicate, cb.equal(root.get("province").get("code"), filter.getProvinceCode()));
			if (filter.getDistrictCode() != null)
				predicate = cb.and(predicate, cb.equal(root.get("district").get("code"), filter.getDistrictCode()));
			if (filter.getWardCode() != null)
				predicate = cb.and(predicate, cb.equal(root.get("ward").get("code"), filter.getWardCode()));
			if (filter.getVipId() != null)
				predicate = cb.and(predicate, cb.equal(root.get("vip").get("id"), filter.getVipId()));
			if (Boolean.TRUE.equals(filter.getIsApprovedOnly())) {
				predicate = cb.and(predicate, root.get("status").in(PostStatus.APPROVED, PostStatus.REVIEW_LATER));
			}
			if (filter.getIsDeleteByUser() != null) {
				predicate = cb.and(predicate, cb.equal(root.get("deletedByUser"), filter.getIsDeleteByUser()));
			}
			if (filter.getSearch() != null && !filter.getSearch().trim().isEmpty()) {
				Predicate searchPredicate;
				try {
					Long postId = Long.parseLong(filter.getSearch());
					searchPredicate = cb.equal(root.get("id"), postId);
				} catch (NumberFormatException e) {
					Join<Post, User> userJoin = root.join("user");
					searchPredicate = cb.equal(userJoin.get("email"), filter.getSearch());
				}
				predicate = cb.and(predicate, searchPredicate);
			}

			// ==========================================
			// LỌC BẢNG PHỤ (LISTING_DETAIL)
			// ==========================================
			// Dùng LEFT JOIN để lỡ bài post không có detail (như đất nền) thì vẫn không bị
			// lỗi rớt data
			Join<Post, ListingDetail> detailJoin = root.join("listingDetail", JoinType.LEFT);

			if (filter.getBedrooms() != null) {
				if (filter.getBedrooms() >= 5) {
					predicate = cb.and(predicate, cb.greaterThanOrEqualTo(detailJoin.get("bedrooms"), 5));
				} else {
					predicate = cb.and(predicate, cb.equal(detailJoin.get("bedrooms"), filter.getBedrooms()));
				}
			}

			if (filter.getBathrooms() != null) {
				if (filter.getBathrooms() >= 5) {
					predicate = cb.and(predicate, cb.greaterThanOrEqualTo(detailJoin.get("bathrooms"), 5));
				} else {
					predicate = cb.and(predicate, cb.equal(detailJoin.get("bathrooms"), filter.getBathrooms()));
				}
			}

			if (filter.getDirection() != null) {
				predicate = cb.and(predicate, cb.equal(detailJoin.get("direction"), filter.getDirection()));
			}

			if (filter.getBalconyDirection() != null) {
				predicate = cb.and(predicate,
						cb.equal(detailJoin.get("balconyDirection"), filter.getBalconyDirection()));
			}

			if (filter.getLegalStatus() != null) {
				predicate = cb.and(predicate, cb.equal(detailJoin.get("legalStatus"), filter.getLegalStatus()));
			}

			if (filter.getFurnishing() != null) {
				predicate = cb.and(predicate, cb.equal(detailJoin.get("furnishing"), filter.getFurnishing()));
			}

			return predicate;
		};
	}
}