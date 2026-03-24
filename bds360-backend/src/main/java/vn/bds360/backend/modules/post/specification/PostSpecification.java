package vn.bds360.backend.modules.post.specification;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import vn.bds360.backend.common.constant.PostStatusEnum;
import vn.bds360.backend.common.constant.PostTypeEnum;
import vn.bds360.backend.modules.address.entity.District;
import vn.bds360.backend.modules.address.entity.Province;
import vn.bds360.backend.modules.address.entity.Ward;
import vn.bds360.backend.modules.post.entity.Post;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.vip.entity.Vip;

public class PostSpecification {

	public static Specification<Post> filterBy(
			Long minPrice, Long maxPrice, Double minArea, Double maxArea,
			PostStatusEnum status, Long categoryId, PostTypeEnum type,
			Long vipId, String search, Boolean deletedByUser) {
		return (root, query, criteriaBuilder) -> {
			Predicate predicate = criteriaBuilder.conjunction();

			// Bộ lọc giá
			if (minPrice != null) {
				predicate = criteriaBuilder.and(predicate,
						criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
			}
			if (maxPrice != null) {
				predicate = criteriaBuilder.and(predicate,
						criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
			}

			// Bộ lọc diện tích
			if (minArea != null) {
				predicate = criteriaBuilder.and(predicate,
						criteriaBuilder.greaterThanOrEqualTo(root.get("area"), minArea));
			}
			if (maxArea != null) {
				predicate = criteriaBuilder.and(predicate,
						criteriaBuilder.lessThanOrEqualTo(root.get("area"), maxArea));
			}

			// Bộ lọc trạng thái
			if (status != null) {
				predicate = criteriaBuilder.and(predicate,
						criteriaBuilder.equal(root.get("status"), status));
			}

			// Bộ lọc danh mục
			if (categoryId != null) {
				predicate = criteriaBuilder.and(predicate,
						criteriaBuilder.equal(root.get("category").get("id"), categoryId));
			}

			// Bộ lọc loại bài đăng
			if (type != null) {
				predicate = criteriaBuilder.and(predicate,
						criteriaBuilder.equal(root.get("type"), type));
			}

			// Bộ lọc VIP
			if (vipId != null) {
				Join<Post, Vip> vipJoin = root.join("vip");
				predicate = criteriaBuilder.and(predicate,
						criteriaBuilder.equal(vipJoin.get("id"), vipId));
			}

			// Bộ lọc deletedByUser
			if (deletedByUser != null) {
				predicate = criteriaBuilder.and(predicate,
						criteriaBuilder.equal(root.get("deletedByUser"), deletedByUser));
			}

			// Bộ lọc search (postId hoặc email)
			if (search != null && !search.trim().isEmpty()) {
				Predicate searchPredicate = criteriaBuilder.disjunction(); // OR condition

				// Thử parse search thành postId
				try {
					Long postId = Long.parseLong(search);
					searchPredicate = criteriaBuilder.or(searchPredicate,
							criteriaBuilder.equal(root.get("id"), postId));
				} catch (NumberFormatException e) {
					// Nếu không parse được thành Long, coi search là email
					Join<Post, User> userJoin = root.join("user");
					searchPredicate = criteriaBuilder.or(searchPredicate,
							criteriaBuilder.equal(userJoin.get("email"), search));
				}

				predicate = criteriaBuilder.and(predicate, searchPredicate);
			}

			return predicate;
		};
	}

	public static Specification<Post> filterBy(
			Long minPrice, Long maxPrice, Double minArea, Double maxArea,
			Long provinceCode, Long districtCode, Long wardCode,
			Long categoryId, PostTypeEnum type) {
		return (root, query, criteriaBuilder) -> {
			Predicate predicate = criteriaBuilder.conjunction();

			if (minPrice != null) {
				predicate = criteriaBuilder.and(predicate,
						criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
			}
			if (maxPrice != null) {
				predicate = criteriaBuilder.and(predicate,
						criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
			}
			if (minArea != null) {
				predicate = criteriaBuilder.and(predicate,
						criteriaBuilder.greaterThanOrEqualTo(root.get("area"), minArea));
			}
			if (maxArea != null) {
				predicate = criteriaBuilder.and(predicate,
						criteriaBuilder.lessThanOrEqualTo(root.get("area"), maxArea));
			}
			if (provinceCode != null) {
				Join<Post, Province> provinceJoin = root.join("province");
				predicate = criteriaBuilder.and(predicate,
						criteriaBuilder.equal(provinceJoin.get("code"), provinceCode));
			}
			if (districtCode != null) {
				Join<Post, District> districtJoin = root.join("district");
				predicate = criteriaBuilder.and(predicate,
						criteriaBuilder.equal(districtJoin.get("code"), districtCode));
			}
			if (wardCode != null) {
				Join<Post, Ward> wardJoin = root.join("ward");
				predicate = criteriaBuilder.and(predicate,
						criteriaBuilder.equal(wardJoin.get("code"), wardCode));
			}
			if (categoryId != null) {
				predicate = criteriaBuilder.and(predicate,
						criteriaBuilder.equal(root.get("category").get("id"), categoryId));
			}
			if (type != null) {
				predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("type"), type));
			}

			predicate = criteriaBuilder.and(predicate,
					criteriaBuilder.equal(root.get("deletedByUser"), false));

			return predicate;
		};
	}

}
