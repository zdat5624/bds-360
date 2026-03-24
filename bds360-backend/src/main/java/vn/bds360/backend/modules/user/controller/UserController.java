package vn.bds360.backend.modules.user.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.bds360.backend.common.constant.GenderEnum;
import vn.bds360.backend.common.constant.RoleEnum;
import vn.bds360.backend.common.dto.response.ResCreateUserDTO;
import vn.bds360.backend.common.exception.ForbiddenException;
import vn.bds360.backend.common.exception.InputInvalidException;
import vn.bds360.backend.modules.user.dto.request.CreateUserDTO;
import vn.bds360.backend.modules.user.dto.request.UpdateProfileDTO;
import vn.bds360.backend.modules.user.dto.request.UserUpdateDTO;
import vn.bds360.backend.modules.user.dto.response.ResUpdateUserDTO;
import vn.bds360.backend.modules.user.dto.response.UserDTO;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.service.UserService;
import vn.bds360.backend.security.SecurityUtil;

@RestController
public class UserController {

    private UserService userService;
    final private PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/api/admin/users")
    public ResponseEntity<ResCreateUserDTO> createNewUser(@Valid @RequestBody CreateUserDTO createUserDTO)
            throws InputInvalidException {

        boolean isEmailExist = this.userService.isEmailExist(createUserDTO.getEmail());
        if (isEmailExist) {
            throw new InputInvalidException(
                    "Email " + createUserDTO.getEmail() + " đã tồn tại, vui lòng sử dụng email khác.");
        }

        String hashPassword = this.passwordEncoder.encode(createUserDTO.getPassword());
        createUserDTO.setPassword(hashPassword);
        User newUser = this.userService.handleCreateUser(createUserDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(new ResCreateUserDTO(newUser));
    }

    @DeleteMapping("/api/admin/users/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable("id") long id) throws InputInvalidException {

        if (this.userService.fetchUserById(id) == null) {
            throw new InputInvalidException("Id không hợp lệ: không tìm thấy user id " + id + ", ...");
        }

        this.userService.handleDeleteUser(id);

        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    @GetMapping("/api/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") long id) {
        String currentUserEmail = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new ForbiddenException("Không tìm thấy thông tin người dùng đang đăng nhập."));
        User currentUser = userService.handleGetUserByUserName(currentUserEmail);
        if (currentUser == null) {
            throw new ForbiddenException("Người dùng đăng nhập không tồn tại.");
        }

        boolean isAdmin = currentUser.getRole().equals(RoleEnum.ADMIN);
        boolean isOwner = currentUser.getId() == id;

        if (!isAdmin && !isOwner) {
            throw new ForbiddenException("Bạn không có quyền truy cập thông tin người dùng này");
        }

        User fetchUser = this.userService.fetchUserById(id);
        return ResponseEntity.status(HttpStatus.OK).body(fetchUser);
    }

    @PutMapping("/api/admin/users")
    public ResponseEntity<ResUpdateUserDTO> updateUser(@Valid @RequestBody UserUpdateDTO userUpdateDTO)
            throws InputInvalidException {

        User newUser = this.userService.handleUpdateUser(userUpdateDTO);
        if (newUser == null) {
            throw new InputInvalidException(
                    "User id " + userUpdateDTO.getId() + " không tồn tại.");
        }
        return ResponseEntity.status(HttpStatus.OK).body(new ResUpdateUserDTO(newUser));
    }

    @PutMapping("/api/users/update-profile")
    public ResponseEntity<ResUpdateUserDTO> updateProfile(@Valid @RequestBody UpdateProfileDTO userUpdateDTO)
            throws InputInvalidException, AccessDeniedException {

        // Get the authenticated user's email from the security context
        String currentUserEmail = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new AccessDeniedException("Không tìm thấy thông tin người dùng hiện tại."));

        // Fetch the authenticated user by email
        User currentUser = userService.handleGetUserByUserName(currentUserEmail);
        if (currentUser == null) {
            throw new AccessDeniedException("Người dùng hiện tại không tồn tại.");
        }

        // Check if the authenticated user is the owner of the profile
        if (currentUser.getId() != userUpdateDTO.getId()) {
            throw new AccessDeniedException("Bạn không có quyền cập nhật hồ sơ của người dùng khác.");
        }

        // Proceed with updating the profile
        User updatedUser = this.userService.handleUpdateProfile(userUpdateDTO);
        if (updatedUser == null) {
            throw new InputInvalidException(
                    "User id " + userUpdateDTO.getId() + " không tồn tại.");
        }

        return ResponseEntity.status(HttpStatus.OK).body(new ResUpdateUserDTO(updatedUser));
    }

    @GetMapping("/api/admin/users")
    public ResponseEntity<Page<UserDTO>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) RoleEnum role,
            @RequestParam(required = false) GenderEnum gender,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {
        Page<UserDTO> users = userService.getUsers(page, size, role, gender, search, sortBy, sortDirection);
        return ResponseEntity.ok(users);
    }
}
