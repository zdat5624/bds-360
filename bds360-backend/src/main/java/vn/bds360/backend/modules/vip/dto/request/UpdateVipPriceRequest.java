package vn.bds360.backend.modules.vip.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateVipPriceRequest {

    @NotNull(message = "Giá mới không được để trống")
    @Min(value = 0, message = "Giá gói VIP không được nhỏ hơn 0")
    private Long newPrice;
}