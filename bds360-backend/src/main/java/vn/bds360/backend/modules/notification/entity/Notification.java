package vn.bds360.backend.modules.notification.entity;

import java.time.Instant;

import org.springframework.boot.security.autoconfigure.SecurityProperties.User;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.NotificationType;

@Getter
@Setter
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(columnDefinition = "MEDIUMTEXT")
    @NotBlank(message = "Nội dung thông báo không được để trống")
    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private boolean isRead;
    private Instant createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @PrePersist
    public void handleBeforeCreate() {
        this.createdAt = Instant.now();
    }

}
