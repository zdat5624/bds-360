package vn.bds360.backend.modules.user.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import vn.bds360.backend.common.constant.GenderEnum;
import vn.bds360.backend.common.constant.RoleEnum;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.common.dto.response.PageResponse;
import vn.bds360.backend.modules.user.dto.request.CreateUserRequest;
import vn.bds360.backend.modules.user.dto.request.UpdateProfileRequest;
import vn.bds360.backend.modules.user.dto.request.UpdateUserRequest;
import vn.bds360.backend.modules.user.dto.response.UserResponse;
import vn.bds360.backend.modules.user.service.UserService;
import vn.bds360.backend.security.annotation.IsAdmin;
import vn.bds360.backend.security.annotation.RequireLogin;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
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
    public ApiResponse<PageResponse<UserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) RoleEnum role,
            @RequestParam(required = false) GenderEnum gender,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        PageResponse<UserResponse> pageData = userService.getUsers(page, size, role, gender, search, sortBy,
                sortDirection);
        return ApiResponse.success(pageData, "Lấy danh sách người dùng thành công");
    }

    // ==========================================
    // NHÓM API DÀNH CHO USER ĐÃ ĐĂNG NHẬP
    // ==========================================

    @GetMapping("/users/{id}")
    @ResponseStatus(HttpStatus.OK)
    @RequireLogin
    public ApiResponse<UserResponse> getUserById(@PathVariable("id") long id, Principal principal) {
        return ApiResponse.success(userService.fetchUserByIdWithPermission(id, principal.getName()),
                "Lấy thông tin người dùng thành công");
    }

    @PutMapping("/users/update-profile")
    @ResponseStatus(HttpStatus.OK)
    @RequireLogin
    public ApiResponse<UserResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request,
            Principal principal) {
        return ApiResponse.success(userService.handleUpdateProfile(request, principal.getName()),
                "Cập nhật hồ sơ thành công");
    }
}