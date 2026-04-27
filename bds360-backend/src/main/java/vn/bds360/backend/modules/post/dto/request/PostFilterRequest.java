// File: @/modules/post/dto/request/PostFilterRequest.java
package vn.bds360.backend.modules.post.dto.request;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.ListingType;
import vn.bds360.backend.common.dto.request.BaseFilterRequest;
import vn.bds360.backend.modules.post.constant.CompassDirection;
import vn.bds360.backend.modules.post.constant.Furnishing;
import vn.bds360.backend.modules.post.constant.LegalStatus;
import vn.bds360.backend.modules.post.constant.PostStatus;

@Getter
@Setter
public class PostFilterRequest extends BaseFilterRequest {
    private Long minPrice;
    private Long maxPrice;
    private Double minArea;
    private Double maxArea;
    private Long categoryId;
    private ListingType type;
    private Long provinceCode;
    private Long districtCode;
    private Long wardCode;
    private Long vipId;
    private String search;

    private Boolean isHidden;

    // 🌟 THÊM TRƯỜNG NÀY (Mặc định tìm theo ID)
    private List<String> searchBy = new ArrayList<>(List.of("id"));

    private Boolean isDeleteByUser = false;
    private Boolean isApprovedOnly = false;

    private Integer bedrooms;
    private Integer bathrooms;
    private CompassDirection houseDirection;
    private CompassDirection balconyDirection;
    private LegalStatus legalStatus;
    private Furnishing furnishing;

    private List<PostStatus> statuses;
    private String userEmail;
    private Integer userId;

    @Pattern(regexp = "^(id|pushedAt|createdAt|price|area|view|title|status|expireDate)$", message = "Trường sắp xếp (sortBy) không hợp lệ đối với tin đăng.")
    private String sortBy = "pushedAt";
}