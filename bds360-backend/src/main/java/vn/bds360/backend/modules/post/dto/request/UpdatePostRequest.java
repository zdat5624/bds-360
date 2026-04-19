// --- File: post/dto/request/UpdatePostRequest.java ---
package vn.bds360.backend.modules.post.dto.request;

import java.util.List;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.ListingType;

@Getter
@Setter
public class UpdatePostRequest {

    @NotNull(message = "ID tin đăng không được để trống")
    private Long id;

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 255, message = "Tiêu đề không được quá 255 ký tự")
    private String title;

    @NotBlank(message = "Mô tả không được để trống")
    private String description;

    @NotNull(message = "Loại tin đăng không được để trống")
    private ListingType type;

    @Min(value = 0, message = "Giá phải lớn hơn hoặc bằng 0")
    private Long price;

    @DecimalMin(value = "0.1", message = "Diện tích phải lớn hơn 0")
    private Double area;

    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;

    @NotNull(message = "Tỉnh/Thành phố không được để trống")
    private Long provinceCode;

    @NotNull(message = "Quận/Huyện không được để trống")
    private Long districtCode;

    private Long wardCode;

    @NotBlank(message = "Địa chỉ chi tiết không được để trống")
    @Size(max = 255, message = "Địa chỉ chi tiết không được quá 255 ký tự")
    private String streetAddress;

    @NotNull(message = "Phải có ít nhất 1 ảnh")
    private List<String> imageUrls;

    private Double latitude;

    private Double longitude;

    private ListingDetailRequest listingDetail;
}