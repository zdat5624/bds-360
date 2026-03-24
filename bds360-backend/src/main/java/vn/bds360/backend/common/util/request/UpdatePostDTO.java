package vn.bds360.backend.common.util.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.modules.address.entity.District;
import vn.bds360.backend.modules.address.entity.Province;
import vn.bds360.backend.modules.address.entity.Ward;
import vn.bds360.backend.modules.category.entity.Category;
import vn.bds360.backend.modules.post.entity.Image;

import java.util.List;

@Getter
@Setter
public class UpdatePostDTO {

    @NotNull(message = "ID tin đăng không được để trống")
    private Long id;

    @Size(max = 255, message = "Tiêu đề không được quá 255 ký tự")
    private String title;

    @Size(max = 16777215, message = "Mô tả quá dài")
    private String description;

    private vn.bds360.backend.common.constant.PostTypeEnum type;

    @Min(value = 0, message = "Giá phải lớn hơn hoặc bằng 0")
    private Long price;

    @DecimalMin(value = "0.1", message = "Diện tích phải lớn hơn 0")
    private Double area;

    private Province province;

    private District district;

    private Ward ward;

    @Size(max = 255, message = "Địa chỉ chi tiết không được quá 255 ký tự")
    private String detailAddress;

    private Category category;

    private List<Image> images;

    private Double latitude;

    private Double longitude;
}