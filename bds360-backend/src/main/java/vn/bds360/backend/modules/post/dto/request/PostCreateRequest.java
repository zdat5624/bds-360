package vn.bds360.backend.modules.post.dto.request;

import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.bds360.backend.common.constant.ListingType;

@Data
public class PostCreateRequest {
    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    @NotBlank(message = "Mô tả không được để trống")
    private String description;

    @NotNull(message = "Loại tin đăng không được để trống")
    private ListingType type;

    @Min(value = 0, message = "Giá phải lớn hoặc bằng 0")
    private Long price;

    @Min(value = 1, message = "Diện tích phải lớn hơn 0")
    private Double area;

    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;

    private Long provinceCode;
    private Long districtCode;
    private Long wardCode;
    private String streetAddress;

    private Long vipId;

    @NotNull(message = "Phải có ít nhất 1 ảnh")
    private List<String> imageUrls;

    private ListingDetailRequest listingDetail;

    @Min(value = 1, message = "Số ngày đăng tối thiểu là 1")
    private int numberOfDays;
}