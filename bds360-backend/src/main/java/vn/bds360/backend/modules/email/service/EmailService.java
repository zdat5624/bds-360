package vn.bds360.backend.modules.email.service;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;

import org.springframework.mail.MailException;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final MailSender mailSender;
    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;

    public EmailService(MailSender mailSender,
            JavaMailSender javaMailSender,
            SpringTemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
    }

    public void sendSimpleEmail() {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo("zdat5624@gmail.com");
        msg.setSubject("Testing from Spring Boot");
        msg.setText("Hello World from Spring Boot Email");
        this.mailSender.send(msg);
    }

    public void sendEmailSync(String to, String subject, String content, boolean isMultipart, boolean isHtml) {
        MimeMessage mimeMessage = this.javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, isMultipart, StandardCharsets.UTF_8.name());
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content, isHtml);
            this.javaMailSender.send(mimeMessage);
        } catch (MailException | MessagingException e) {
            System.out.println("ERROR SEND EMAIL: " + e);
        }
    }

    @Async
    public void sendEmailFromTemplateSync(
            String to,
            String subject,
            String templateName,
            String username,
            Object value) {
        Context context = new Context();
        context.setVariable("username", username);
        context.setVariable("code", value);

        String content = templateEngine.process(templateName, context);
        this.sendEmailSync(to, subject, content, false, true);
    }

    public String generateResetCode() {
        SecureRandom random = new SecureRandom();
        int code = 10000 + random.nextInt(90000);
        return String.valueOf(code);
    }

    @Async
    public void sendForgotPasswordEmail(String to, String username, String resetCode) {
        String subject = "Mã Xác Nhận Đặt Lại Mật Khẩu - api";
        sendEmailFromTemplateSync(to, subject, "forgot-password", username, resetCode);
    }

    @Async
    public void sendDepositSuccessEmail(
            String to,
            String username,
            double amount,

            String transactionTime) {
        Context context = new Context();
        context.setVariable("username", username);
        context.setVariable("amount", String.format("%,.0f", amount));
        // context.setVariable("transactionId", transactionId);
        context.setVariable("transactionTime", transactionTime);

        String subject = "Nạp Tiền Thành Công - api";
        String templateName = "deposit-success";
        String content = templateEngine.process(templateName, context);
        this.sendEmailSync(to, subject, content, false, true);
    }
}