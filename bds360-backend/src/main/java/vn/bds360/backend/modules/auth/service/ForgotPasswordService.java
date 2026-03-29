package vn.bds360.backend.modules.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.modules.auth.entity.PasswordResetToken;
import vn.bds360.backend.modules.auth.repository.PasswordResetTokenRepository;
import vn.bds360.backend.modules.email.service.EmailService;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.repository.UserRepository;

import java.time.Instant;
import vn.bds360.backend.modules.user.service.UserService;

@Service
@RequiredArgsConstructor
public class ForgotPasswordService {

    private final UserService userService;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String resetCode = emailService.generateResetCode();

        PasswordResetToken token = new PasswordResetToken();
        token.setToken(resetCode);
        token.setUser(user);
        tokenRepository.save(token);

        emailService.sendForgotPasswordEmail(email, user.getName(), resetCode);
    }

    public void resetPassword(String email, String code, String newPassword) {
        PasswordResetToken token = tokenRepository.findByTokenAndUserEmail(code, email)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_OTP_CODE));

        if (Instant.now().isAfter(token.getExpirationTime())) {
            throw new AppException(ErrorCode.TOKEN_EXPIRED);
        }

        String encodedPassword = passwordEncoder.encode(newPassword);
        userService.forceUpdatePassword(email, encodedPassword);

        tokenRepository.delete(token);
    }
}