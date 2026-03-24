package vn.bds360.backend.modules.user.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import vn.bds360.backend.common.constant.GenderEnum;
import vn.bds360.backend.common.constant.RoleEnum;
import vn.bds360.backend.common.exception.InputInvalidException;
import vn.bds360.backend.common.exception.NotFoundException;
import vn.bds360.backend.common.util.request.UserUpdateDTO;
import vn.bds360.backend.modules.user.dto.request.CreateUserDTO;
import vn.bds360.backend.modules.user.dto.request.UpdateProfileDTO;
import vn.bds360.backend.modules.user.dto.response.UserDTO;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.repository.UserRepository;
import vn.bds360.backend.modules.user.specification.UserSpecification;

@Service
public class UserService {

    private UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User handleCreateUser(CreateUserDTO createUserDTO) {
        User user = new User();
        user.setName(createUserDTO.getName());
        user.setPhone(createUserDTO.getPhone());
        user.setEmail(createUserDTO.getEmail());
        user.setPassword(createUserDTO.getPassword());
        user.setRole(createUserDTO.getRole());
        user.setGender(createUserDTO.getGender());
        user.setAddress(createUserDTO.getAddress());
        return this.userRepository.save(user);
    }

    public User handleCreateUser(User user) {

        return this.userRepository.save(user);
    }

    public void handleDeleteUser(long id) {
        this.userRepository.deleteById(id);
    }

    public User fetchUserById(long id) {
        return this.userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng với ID: " + id));
    }

    public User handleGetUserByUserName(String username) {
        Optional<User> userOptional = this.userRepository.findByEmail(username);
        if (userOptional.isPresent()) {
            return userOptional.get();
        }
        return null;
    }

    public List<User> fetchAllUser() {
        return this.userRepository.findAll();
    }

    public User handleUpdateUser(UserUpdateDTO userUpdateDTO) {
        User currentUser = fetchUserById(userUpdateDTO.getId());
        if (currentUser != null) {
            currentUser.setName(userUpdateDTO.getName());
            currentUser.setRole(userUpdateDTO.getRole());
            currentUser.setGender(userUpdateDTO.getGender());
            currentUser.setAvatar(userUpdateDTO.getAvatar());
            currentUser.setPhone(userUpdateDTO.getPhone());
            currentUser.setAddress(userUpdateDTO.getAddress());
            return currentUser = this.userRepository.save(currentUser);
        }
        return null;
    }

    public User handleUpdateProfile(UpdateProfileDTO userUpdateDTO) {
        User currentUser = fetchUserById(userUpdateDTO.getId());
        if (currentUser != null) {
            currentUser.setName(userUpdateDTO.getName());
            currentUser.setGender(userUpdateDTO.getGender());
            currentUser.setAvatar(userUpdateDTO.getAvatar());
            currentUser.setPhone(userUpdateDTO.getPhone());
            currentUser.setAddress(userUpdateDTO.getAddress());
            return currentUser = this.userRepository.save(currentUser);
        }
        return null;
    }

    public boolean isEmailExist(String email) {
        return this.userRepository.existsByEmail(email);
    }

    public Page<UserDTO> getUsers(int page, int size, RoleEnum role, GenderEnum gender, String search, String sortBy,
            String sortDirection) {
        Sort sort = Sort.by(sortDirection.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<User> userPage = userRepository.findAll(
                UserSpecification.filterUsers(role, gender, search),
                pageable);
        return userPage.map(this::convertToDTO);
    }

    public void changePassword(String email, String currentPassword, String newPassword)
            throws vn.bds360.backend.common.exception.InputInvalidException {
        User user = handleGetUserByUserName(email);
        if (user == null) {
            throw new InputInvalidException("Người dùng không tồn tại, vui lòng kiểm tra lại đăng nhập!");
        }
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new InputInvalidException("Mật khẩu hiện tại không đúng");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setGender(user.getGender());
        dto.setBalance(user.getBalance());
        dto.setAvatar(user.getAvatar());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}
