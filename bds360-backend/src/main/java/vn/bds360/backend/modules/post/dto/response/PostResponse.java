package vn.bds360.backend.modules.post.dto.response;

import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.bds360.backend.common.constant.ListingType;
import vn.bds360.backend.modules.post.constant.CompassDirection;
import vn.bds360.backend.modules.post.constant.Furnishing;
import vn.bds360.backend.modules.post.constant.LegalStatus;
import vn.bds360.backend.modules.post.constant.PostStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class

PostResponse {

    // --- THÔNG TIN CƠ BẢN ---
    private Long id;
    private String title;
    private String description;
    private ListingType type;
    private Long price;
    private Double area;
    private Long view;
    private PostStatus status;
    private Instant expireDate;
    private Instant createdAt;
    private Instant updatedAt;

    // --- THÔNG TIN ĐỊA CHỈ (Đã được làm phẳng) ---
    private String streetAddress;
    private Double latitude;
    private Double longitude;
    private Long provinceCode;
    private String provinceName;
    private Long districtCode;
    private String districtName;
    private Long wardCode;
    private String wardName;

    // --- QUAN HỆ (Dùng Sub-DTO để ngắt vòng lặp) ---
    private CategoryResponse category;
    private AuthorResponse user; // Đổi tên thành user cho khớp Entity, nhưng dùng class AuthorResponse
    private VipResponse vip;
    private List<ImageResponse> images;

    private ListingDetailResponse listingDetail;

    // =================================================================
    // SUB-DTOs (Inner Classes giúp code gọn gàng, không đẻ thêm file)
    // =================================================================

    @Data
    public static class CategoryResponse {
        private Long id;
        private String name;
    }

    @Data
    public static class AuthorResponse {
        private Long id;
        private String name; // Tên hiển thị
        private String email;
        private String phone; // Quan trọng để khách hàng gọi điện
        private String avatar;
    }

    @Data
    public static class VipResponse {
        private Long id;
        private String name;
        private Integer vipLevel;
    }

    @Data
    public static class ImageResponse {
        private Long id;
        private String url;
        private Integer orderIndex;
    }

    @Data
    public static class ListingDetailResponse {
        private Integer bedrooms;
        private Integer bathrooms;
        private CompassDirection houseDirection;
        private CompassDirection balconyDirection;
        private LegalStatus legalStatus;
        private Furnishing furnishing;
    }
}