package vn.bds360.backend.common.util.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.bds360.backend.common.constant.GenderEnum;
import vn.bds360.backend.common.constant.RoleEnum;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResLoginDTO {
    private String accessToken;

    private UserLogin user;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserLogin {
        private long id;
        private String email;
        private String name;
        private RoleEnum role;
        private String avatar;
        private long balance;
        private GenderEnum gender;
        private String phone;

    }
}
