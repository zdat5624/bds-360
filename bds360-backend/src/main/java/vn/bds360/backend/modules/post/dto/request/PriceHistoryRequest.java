// vn/bds360/backend/modules/post/dto/request/PriceHistoryRequest.java
package vn.bds360.backend.modules.post.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.ListingType;

@Getter
@Setter
public class PriceHistoryRequest {
    @NotNull(message = "Loại giao dịch không được để trống")
    private ListingType type;

    private Long categoryId;
    private Long provinceCode;
    private Long districtCode;
    private Long wardCode;

    // Thời gian lấy dữ liệu: Mặc định 12 tháng (1 năm)
    private Integer months = 12;
}