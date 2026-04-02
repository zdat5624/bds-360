package vn.bds360.backend.modules.post.specification;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import vn.bds360.backend.common.constant.PostStatusEnum;
import vn.bds360.backend.modules.post.dto.request.PostFilterRequest;
import vn.bds360.backend.modules.post.entity.Post;
import vn.bds360.backend.modules.user.entity.User;

public class PostSpecification {

	public static Specification<Post> filterBy(PostFilterRequest filter) {
		return (root, query, cb) -> {
			Predicate predicate = cb.conjunction();

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

			// Xử lý riêng biệt cho Public User (chỉ xem bài đã duyệt)
			if (Boolean.TRUE.equals(filter.getIsApprovedOnly())) {
				predicate = cb.and(predicate,
						root.get("status").in(PostStatusEnum.APPROVED, PostStatusEnum.REVIEW_LATER));
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

			return predicate;
		};
	}
}