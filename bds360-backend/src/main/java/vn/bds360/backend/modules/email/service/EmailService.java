package vn.bds360.backend.modules.email.service;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;

    /**
     * Hàm gửi email lõi (Core)
     * Được để private hoặc protected vì các module khác nên gọi qua các hàm
     * template cụ thể
     */
    @Async
    protected void sendEmail(String to, String subject, String content, boolean isHtml) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, false, StandardCharsets.UTF_8.name());
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content, isHtml);

            javaMailSender.send(mimeMessage);
            log.info(">>> Email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error(">>> ERROR SENDING EMAIL to {}: {}", to, e.getMessage());
            // Với Email, thường chúng ta không throw Exception ra ngoài để tránh làm hỏng
            // luồng chính (như Đăng ký)
            // Chỉ cần log lại để kiểm tra hệ thống.
        }
    }

    @Async
    public void sendForgotPasswordEmail(String to, String username, String resetCode) {
        Context context = new Context();
        context.setVariable("username", username);
        context.setVariable("code", resetCode);

        String content = templateEngine.process("forgot-password", context);
        String subject = "Mã Xác Nhận Đặt Lại Mật Khẩu - BDS360";

        this.sendEmail(to, subject, content, true);
    }

    @Async
    public void sendDepositSuccessEmail(String to, String username, double amount, String transactionTime) {
        Context context = new Context();
        context.setVariable("username", username);
        context.setVariable("amount", String.format("%,.0f", amount));
        context.setVariable("transactionTime", transactionTime);

        String content = templateEngine.process("deposit-success", context);
        String subject = "Nạp Tiền Thành Công - BDS360";

        this.sendEmail(to, subject, content, true);
    }

    public String generateResetCode() {
        SecureRandom random = new SecureRandom();
        int code = 10000 + random.nextInt(90000);
        return String.valueOf(code);
    }
}