package vn.bds360.backend.modules.post.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import vn.bds360.backend.modules.post.constant.CompassDirection;
import vn.bds360.backend.modules.post.constant.Furnishing;
import vn.bds360.backend.modules.post.constant.LegalStatus;

@Data
public class ListingDetailRequest {

    @Min(value = 1, message = "Số phòng ngủ phải từ 1 trở lên")
    @Max(value = 100, message = "Số phòng ngủ không hợp lệ")
    private Integer bedrooms;

    @Min(value = 1, message = "Số phòng tắm, vệ sinh phải từ 1 trở lên")
    @Max(value = 100, message = "Số phòng tắm không hợp lệ")
    private Integer bathrooms;

    private CompassDirection houseDirection;

    private CompassDirection balconyDirection;

    private LegalStatus legalStatus;

    private Furnishing furnishing;
}