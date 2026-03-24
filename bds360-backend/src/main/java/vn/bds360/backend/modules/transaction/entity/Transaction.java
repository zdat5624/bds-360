package vn.bds360.backend.modules.transaction.entity;

import java.time.Instant;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.TransStatusEnum;
import vn.bds360.backend.modules.user.entity.User;

@Getter
@Setter
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private long amount;

    @Enumerated(EnumType.STRING)
    private TransStatusEnum status;

    @Column(columnDefinition = "TEXT")
    private String paymentLink;

    @Column(unique = true)
    private String txnId;

    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Instant createdAt;

    private Instant updatedAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}
