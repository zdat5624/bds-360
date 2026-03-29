package vn.bds360.backend.modules.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import vn.bds360.backend.common.constant.GenderEnum;
import vn.bds360.backend.common.constant.RoleEnum;
import vn.bds360.backend.common.dto.response.PageResponse;
import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.common.util.PageUtils;
import vn.bds360.backend.modules.user.dto.request.CreateUserRequest;
import vn.bds360.backend.modules.user.dto.request.UpdateProfileRequest;
import vn.bds360.backend.modules.user.dto.request.UpdateUserRequest;
import vn.bds360.backend.modules.user.dto.response.UserResponse;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.mapper.UserMapper;
import vn.bds360.backend.modules.user.repository.UserRepository;
import vn.bds360.backend.modules.user.specification.UserSpecification;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    // Đã đổi kiểu trả về thành UserResponse
    public UserResponse handleCreateUser(CreateUserRequest request) {
        if (isEmailExist(request.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = new User();
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setGender(request.getGender());
        user.setAddress(request.getAddress());

        user = userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    // Hàm nội bộ cho Auth (giữ nguyên trả Entity)
    public User handleCreateUser(User user) {
        return userRepository.save(user);
    }

    public void handleDeleteUser(long id) {
        User user = fetchUserById(id);
        userRepository.delete(user);
    }

    // Hàm nội bộ tìm User theo ID (ném lỗi nếu không thấy)
    public User fetchUserById(long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    // Hàm nội bộ tìm User theo Email (trả null nếu không thấy)
    public User handleGetUserByUserName(String username) {
        return userRepository.findByEmail(username).orElse(null);
    }

    // Đã đổi kiểu trả về thành UserResponse
    public UserResponse fetchUserByIdWithPermission(long targetUserId, String currentUsername) {
        User currentUser = handleGetUserByUserName(currentUsername);
        if (currentUser == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        boolean isAdmin = currentUser.getRole().equals(RoleEnum.ADMIN);
        boolean isOwner = currentUser.getId() == targetUserId;

        if (!isAdmin && !isOwner) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        User targetUser = fetchUserById(targetUserId);
        return userMapper.toUserResponse(targetUser); // 👉 Dùng Mapper tại đây
    }

    // Đã đổi kiểu trả về thành UserResponse
    public UserResponse handleUpdateUser(UpdateUserRequest request) {
        User currentUser = fetchUserById(request.getId());

        currentUser.setName(request.getName());
        currentUser.setRole(request.getRole());
        currentUser.setGender(request.getGender());
        currentUser.setAvatar(request.getAvatar());
        currentUser.setPhone(request.getPhone());
        currentUser.setAddress(request.getAddress());

        currentUser = userRepository.save(currentUser);
        return userMapper.toUserResponse(currentUser);
    }

    // Đã đổi kiểu trả về thành UserResponse
    public UserResponse handleUpdateProfile(UpdateProfileRequest request, String currentUsername) {
        User currentUser = handleGetUserByUserName(currentUsername);
        if (currentUser == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        if (currentUser.getId() != request.getId()) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        User targetUser = fetchUserById(request.getId());
        targetUser.setName(request.getName());
        targetUser.setGender(request.getGender());
        targetUser.setAvatar(request.getAvatar());
        targetUser.setPhone(request.getPhone());
        targetUser.setAddress(request.getAddress());

        targetUser = userRepository.save(targetUser);
        return userMapper.toUserResponse(targetUser); // 👉 Dùng Mapper tại đây
    }

    public boolean isEmailExist(String email) {
        return userRepository.existsByEmail(email);
    }

    public PageResponse<UserResponse> getUsers(int page, int size, RoleEnum role, GenderEnum gender, String search,
            String sortBy, String sortDirection) {

        // 1. Tạo đối tượng Sort và Pageable
        Sort sort = Sort.by(sortDirection.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        // 2. Query data từ DB trả về Page<User>
        Page<User> userPage = userRepository.findAll(UserSpecification.filterUsers(role, gender, search), pageable);

        // 3. Dùng Utils Generic để biến Page<User> thành PageResponse<UserResponse>
        return PageUtils.toPageResponse(userPage, userMapper::toUserResponse);
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = handleGetUserByUserName(email);
        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new AppException(ErrorCode.WRONG_PASSWORD);
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void forceUpdatePassword(String email, String encodedNewPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setPassword(encodedNewPassword);
        userRepository.save(user);
    }
}