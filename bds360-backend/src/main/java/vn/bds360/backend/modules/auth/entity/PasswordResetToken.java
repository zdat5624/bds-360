package vn.bds360.backend.modules.auth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.modules.user.entity.User;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String token;

    @Column(nullable = false)
    private Instant expirationTime;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    public void handleBeforeCreate() {
        if (this.expirationTime == null) {
            this.expirationTime = Instant.now().plusSeconds(600); // 10 minutes expiration
        }
    }
}