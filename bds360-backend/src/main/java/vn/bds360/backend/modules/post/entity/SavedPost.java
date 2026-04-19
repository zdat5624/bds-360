package vn.bds360.backend.modules.post.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.bds360.backend.modules.user.entity.User;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
// Đảm bảo 1 user không thể lưu 1 bài 2 lần
@Table(name = "saved_posts", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "post_id" })
})
public class SavedPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Column(name = "saved_at", nullable = false)
    private Instant savedAt;

    @PrePersist
    public void prePersist() {

        if (this.savedAt == null) {
            this.savedAt = Instant.now();
        }
    }
}