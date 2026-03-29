package vn.bds360.backend.modules.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.bds360.backend.common.constant.RoleEnum;
import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.modules.auth.dto.request.LoginRequest;
import vn.bds360.backend.modules.auth.dto.request.RegisterRequest;
import vn.bds360.backend.modules.auth.dto.response.LoginResponse;
import vn.bds360.backend.modules.user.dto.response.UserResponse;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.mapper.UserMapper; // Import Mapper
import vn.bds360.backend.modules.user.service.UserService;
import vn.bds360.backend.security.SecurityUtil;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtil securityService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    private final UserMapper userMapper;

    public LoginResponse login(LoginRequest request) {
        try {
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    request.getUsername(), request.getPassword());
            Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = securityService.createToken(authentication);
            User currentUserDB = userService.handleGetUserByUserName(request.getUsername());

            return new LoginResponse(accessToken, userMapper.toUserResponse(currentUserDB));
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }
    }

    public UserResponse register(RegisterRequest request) {
        if (userService.isEmailExist(request.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setPhone(request.getPhone());
        newUser.setEmail(request.getEmail());
        newUser.setGender(request.getGender());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(RoleEnum.USER);

        User savedUser = userService.handleCreateUser(newUser);

        // 3. 1 dòng nhẹ nhàng
        return userMapper.toUserResponse(savedUser);
    }

    public UserResponse getAccount(String email) {
        User currentUserDB = userService.handleGetUserByUserName(email);
        if (currentUserDB == null)
            throw new AppException(ErrorCode.USER_NOT_FOUND);

        // 4. 1 dòng nhẹ nhàng
        return userMapper.toUserResponse(currentUserDB);
    }
}