package vn.bds360.backend.modules.user.dto.request;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.GenderEnum;
import vn.bds360.backend.common.constant.RoleEnum;
import vn.bds360.backend.common.dto.request.BaseFilterRequest;

@Getter
@Setter
public class UserFilterRequest extends BaseFilterRequest {

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
}