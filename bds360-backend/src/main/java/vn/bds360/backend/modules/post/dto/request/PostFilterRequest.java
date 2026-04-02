package vn.bds360.backend.modules.post.dto.request;

import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.ListingType;
import vn.bds360.backend.common.dto.request.BaseFilterRequest;
import vn.bds360.backend.modules.post.constant.Furnishing;
import vn.bds360.backend.modules.post.constant.LegalStatus;
import vn.bds360.backend.modules.post.constant.PostStatus;
import vn.bds360.backend.modules.post.constant.PropertyDirection;

@Getter
@Setter
public class PostFilterRequest extends BaseFilterRequest {
    private Long minPrice;
    private Long maxPrice;
    private Double minArea;
    private Double maxArea;
    private PostStatus status;
    private Long categoryId;
    private ListingType type;
    private Long provinceCode;
    private Long districtCode;
    private Long wardCode;
    private Long vipId;
    private String search; // Tìm theo postId hoặc email
    private Boolean isDeleteByUser = false;
    private Boolean isApprovedOnly = false; // Dùng cho Public API (chỉ lấy tin đã duyệt)

    private Integer bedrooms; // Truyền 1, 2, 3, 4, 5
    private Integer bathrooms; // Truyền 1, 2, 3, 4, 5
    private PropertyDirection direction;
    private PropertyDirection balconyDirection;
    private LegalStatus legalStatus;
    private Furnishing furnishing;
}