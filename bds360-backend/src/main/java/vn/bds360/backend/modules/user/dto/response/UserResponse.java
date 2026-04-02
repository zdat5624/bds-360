package vn.bds360.backend.modules.user.dto.response;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.Gender;
import vn.bds360.backend.common.constant.Role;;

@Getter
@Setter
public class UserResponse {
    private long id;
    private String name;
    private String email;
    private Role role;
    private Gender gender;
    private long balance;
    private String phone;
    private String address;
    private String avatar;
    private Instant createdAt;
    private String createdBy;
    private Instant updatedAt;
    private String updatedBy;

}