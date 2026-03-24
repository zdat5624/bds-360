package vn.bds360.backend.modules.post.entity;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "images")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String url;
    private int orderIndex;
    private Instant createdAt;

    @ManyToOne
    @JoinColumn(name = "post_id")
    @JsonBackReference
    private Post post;

    @PrePersist
    public void handleBeforeCreate() {
        this.createdAt = Instant.now();
    }
}