package vn.bds360.backend.modules.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.annotation.ApiGlobalResponse;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.common.dto.response.PageResponse;
import vn.bds360.backend.modules.user.dto.request.CreateUserRequest;
import vn.bds360.backend.modules.user.dto.request.UpdateProfileRequest;
import vn.bds360.backend.modules.user.dto.request.UpdateUserRequest;
import vn.bds360.backend.modules.user.dto.request.UserFilterRequest;
import vn.bds360.backend.modules.user.dto.response.UserResponse;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.service.UserService;
import vn.bds360.backend.security.annotation.CurrentUser;
import vn.bds360.backend.security.annotation.IsAdmin;
import vn.bds360.backend.security.annotation.RequireLogin;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@ApiGlobalResponse
@Tag(name = "users", description = "Quản lý hồ sơ và thông tin người dùng")
public class UserController {

    private final UserService userService;

    // ==========================================
    // NHÓM API DÀNH CHO ADMIN
    // ==========================================

    @PostMapping("/admin/users")
    @ResponseStatus(HttpStatus.CREATED)
    @IsAdmin
    public ApiResponse<UserResponse> createNewUser(@Valid @RequestBody CreateUserRequest request) {
        return ApiResponse.success(userService.handleCreateUser(request), "Tạo người dùng thành công");
    }

    @DeleteMapping("/admin/users/{id}")
    @ResponseStatus(HttpStatus.OK)
    @IsAdmin
    public ApiResponse<Void> deleteUserById(@PathVariable("id") long id) {
        userService.handleDeleteUser(id);
        return ApiResponse.success(null, "Xóa người dùng thành công");
    }

    @PutMapping("/admin/users")
    @ResponseStatus(HttpStatus.OK)
    @IsAdmin
    public ApiResponse<UserResponse> updateUser(@Valid @RequestBody UpdateUserRequest request) {
        return ApiResponse.success(userService.handleUpdateUser(request), "Cập nhật người dùng thành công");
    }

    @GetMapping("/admin/users")
    @ResponseStatus(HttpStatus.OK)
    @IsAdmin
    public ApiResponse<PageResponse<UserResponse>> getUsers(@Valid @ModelAttribute UserFilterRequest filter) {

        return ApiResponse.success(userService.getUsers(filter), "Lấy danh sách người dùng thành công");
    }

    // ==========================================
    // NHÓM API DÀNH CHO USER ĐÃ ĐĂNG NHẬP
    // ==========================================

    @GetMapping("/users/{id}")
    @ResponseStatus(HttpStatus.OK)
    @RequireLogin
    public ApiResponse<UserResponse> getUserById(@PathVariable("id") long id, @CurrentUser User user) {
        return ApiResponse.success(userService.fetchUserByIdWithPermission(id, user.getEmail()),
                "Lấy thông tin người dùng thành công");
    }

    @PutMapping("/users/update-profile")
    @ResponseStatus(HttpStatus.OK)
    @RequireLogin
    public ApiResponse<UserResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request,
            @CurrentUser User user) {
        return ApiResponse.success(userService.handleUpdateProfile(request, user.getEmail()),
                "Cập nhật hồ sơ thành công");
    }
}