package vn.bds360.backend.modules.auth.service;

import java.util.Collections;
import java.util.UUID;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.constant.Role;
import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.modules.auth.dto.request.GoogleLoginRequest;
import vn.bds360.backend.modules.auth.dto.request.LoginRequest;
import vn.bds360.backend.modules.auth.dto.request.RegisterRequest;
import vn.bds360.backend.modules.auth.dto.response.AuthResponse;
import vn.bds360.backend.modules.user.constant.Gender;
import vn.bds360.backend.modules.user.dto.response.UserResponse;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.mapper.UserMapper; // Import Mapper
import vn.bds360.backend.modules.user.service.UserService;
import vn.bds360.backend.security.SecurityService;
import vn.bds360.backend.security.config.GoogleProperties;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityService securityService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final GoogleProperties googleProperties;
    private final UserMapper userMapper;

    public AuthResponse login(LoginRequest request) {
        try {
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    request.getUsername(), request.getPassword());
            Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = securityService.createToken(authentication);
            User currentUserDB = userService.handleGetUserByUserName(request.getUsername());

            return new AuthResponse(accessToken, userMapper.toUserResponse(currentUserDB));
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }
    }

    public AuthResponse register(RegisterRequest request) {
        if (userService.isEmailExist(request.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User newUser = userMapper.toUser(request);
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(Role.USER);
        User savedUser = userService.saveInternalUser(newUser);

        // --- ĐOẠN THÊM VÀO ĐỂ TỰ ĐỘNG LOGIN SAU KHI ĐĂNG KÝ ---

        // 1. Tạo UserDetails
        org.springframework.security.core.userdetails.UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                savedUser.getEmail(),
                savedUser.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(savedUser.getRole().name())));

        // 2. Tạo Authentication
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Sinh Token
        String accessToken = securityService.createToken(authentication);

        // 4. Trả về AuthResponse
        return new AuthResponse(accessToken, userMapper.toUserResponse(savedUser));
    }

    public UserResponse getAccount(String email) {
        User currentUserDB = userService.handleGetUserByUserName(email);
        if (currentUserDB == null)
            throw new AppException(ErrorCode.USER_NOT_FOUND);

        return userMapper.toUserResponse(currentUserDB);
    }

    public AuthResponse googleLogin(GoogleLoginRequest request) {
        try {
            // 1. Cấu hình GoogleIdTokenVerifier
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),
                    new GsonFactory())
                    .setAudience(Collections.singletonList(googleProperties.getId()))
                    .build();

            // 2. Verify token từ client gửi lên
            GoogleIdToken idToken = verifier.verify(request.getToken());
            if (idToken == null) {
                throw new AppException(ErrorCode.INVALID_CREDENTIALS);
            }

            // 3. Lấy thông tin từ payload
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String avatarUrl = (String) payload.get("picture");
            // 4. Kiểm tra user trong DB (hàm này trả về null nếu không tìm thấy, không cần
            // try-catch)
            User currentUserDB = userService.handleGetUserByUserName(email);

            // 5. Tạo mới nếu chưa tồn tại
            if (currentUserDB == null) {
                User newUser = new User();
                newUser.setEmail(email);

                // Xử lý Name: Nếu Google không có name (hiếm), set tạm 1 tên
                newUser.setName(name != null ? name : "Người dùng " + email.split("@")[0]);

                // Xử lý Avatar: Nhét thẳng link ảnh Google vào
                newUser.setAvatar(avatarUrl);

                newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                newUser.setRole(Role.USER);
                newUser.setGender(Gender.OTHER);

                // FIX BUG: Truyền số điện thoại ảo ("0000000000") thay vì null
                // để vượt qua valid @NotBlank của Entity. User có thể tự update lại sau.
                newUser.setPhone("0000000000");

                currentUserDB = userService.saveInternalUser(newUser);
            }

            // 6. Xác thực hệ thống & Sinh JWT Token đồng bộ với CustomUserDetailsService
            // Khởi tạo UserDetails giống cách CustomUserDetailsService
            org.springframework.security.core.userdetails.UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                    currentUserDB.getEmail(),
                    currentUserDB.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority(currentUserDB.getRole().name())));

            // Truyền userDetails vào làm Principal
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Sinh token
            String accessToken = securityService.createToken(authentication);

            return new AuthResponse(accessToken, userMapper.toUserResponse(currentUserDB));

        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }
    }
}