package vn.bds360.backend.modules.post.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RenewPostRequest {

    @NotNull(message = "Số ngày gia hạn không được để trống")
    @Min(value = 1, message = "Số ngày gia hạn phải từ 1 trở lên")
    private Integer numberOfDays;

    // Gói VIP mới (nếu có), nếu null thì sẽ tiếp tục dùng gói VIP cũ
    private Long vipId;
}
