package vn.bds360.backend.modules.user.dto.request;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.bds360.backend.common.constant.GenderEnum;
import vn.bds360.backend.common.constant.RoleEnum;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserFilterRequest {
    private String name;
    private String email;
    private RoleEnum role;
    private GenderEnum gender;
    private String phone;
    private Long minBalance;
    private Long maxBalance;
    private String address;
    private Instant createdFrom;
    private Instant createdTo;
    private Integer page = 0;
    private Integer size = 10;

}
