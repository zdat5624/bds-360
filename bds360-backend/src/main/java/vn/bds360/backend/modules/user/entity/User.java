package vn.bds360.backend.modules.user.entity;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.GenderEnum;
import vn.bds360.backend.common.constant.RoleEnum;
import vn.bds360.backend.modules.auth.entity.PasswordResetToken;
import vn.bds360.backend.modules.notification.entity.Notification;
import vn.bds360.backend.modules.post.entity.Post;
import vn.bds360.backend.modules.transaction.entity.Transaction;
import vn.bds360.backend.security.SecurityUtil;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name không được để trống")
    private String name;

    @NotBlank(message = "Email không được để trống")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Password không được để trống")
    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    private RoleEnum role;

    @Enumerated(EnumType.STRING)
    private GenderEnum gender;

    private Long balance = 0L;

    private String avatar;

    @NotBlank(message = "Phone không được để trống")
    private String phone;

    private String address;

    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private List<Post> posts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private List<Transaction> transactions;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private List<Notification> notifications;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private List<PasswordResetToken> passwordResetTokens;

    @PrePersist
    public void handleBeforeCreate() {
        String currentUser = SecurityUtil.getCurrentUserLogin().orElse("anonymousUser");

        if ("anonymousUser".equals(currentUser) || currentUser.trim().isEmpty()) {
            this.createdBy = this.email;
        } else {
            this.createdBy = currentUser;
        }

        if (this.avatar == null || this.avatar.trim().isEmpty()) {
            this.avatar = "avatar-default.webp";
        }

        this.createdAt = Instant.now();
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        this.updatedBy = SecurityUtil.getCurrentUserLogin().orElse(this.email);
        this.updatedAt = Instant.now();
    }

}
