package vn.bds360.backend.modules.user.dto.request;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.Gender;
import vn.bds360.backend.common.constant.Role;
import vn.bds360.backend.common.dto.request.BaseFilterRequest;;

@Getter
@Setter
public class UserFilterRequest extends BaseFilterRequest {

    private String name;
    private String email;
    private Role role;
    private Gender gender;
    private String phone;
    private Long minBalance;
    private Long maxBalance;
    private String address;
    private Instant createdFrom;
    private Instant createdTo;
}