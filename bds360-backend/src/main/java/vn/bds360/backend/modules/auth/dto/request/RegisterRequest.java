package vn.bds360.backend.modules.auth.dto.request;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.GenderEnum;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank(message = "Username không được để trống")
    @Size(min = 5, max = 50, message = "Username phải có độ dài từ 5 đến 50 ký tự")
    private String name;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Password không được để trống")
    @Size(min = 6, message = "Password phải có ít nhất 6 ký tự")
    private String password;

    @NotBlank(message = "Phone không được để trống")
    @Pattern(regexp = "^(\\+84|0)[0-9]{9,10}$", message = "Số điện thoại không hợp lệ")
    private String phone;

    @NotNull(message = "Gender không được để trống")
    @Enumerated(EnumType.STRING)
    private GenderEnum gender;
}