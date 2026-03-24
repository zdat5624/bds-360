package vn.bds360.backend.modules.email.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.bds360.backend.modules.email.service.EmailService;

@RestController
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/api/email")
    public String sendSimpleEmail() {
        this.emailService.sendSimpleEmail();
        // this.emailService.sendEmailSync("ads.hoidanit@gmail.com", "test send email",
        // "<h1> <b> hello </b> </h1>", false,
        // true);
        // this.emailService.sendEmailFromTemplateSync("ads.hoidanit@gmail.com", "test
        // send email", "job");
        // this.subscriberService.sendSubscribersEmailJobs();
        return "ok";
    }
}
