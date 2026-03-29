package vn.bds360.backend.modules.user.dto.response;

import java.time.Instant;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.GenderEnum;
import vn.bds360.backend.common.constant.RoleEnum;

@Getter
@Setter
public class UserResponse {
    private long id;
    private String name;
    private String email;
    private RoleEnum role;
    private GenderEnum gender;
    private long balance;
    private String phone;
    private String address;
    private String avatar;
    private Instant createdAt;
    private String createdBy;
    private Instant updatedAt;
    private String updatedBy;

}