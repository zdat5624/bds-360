package vn.bds360.backend.modules.post.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.modules.post.constant.CompassDirection;
import vn.bds360.backend.modules.post.constant.Furnishing;
import vn.bds360.backend.modules.post.constant.LegalStatus;

@Getter
@Setter
@Entity
@Table(name = "listing_details")
public class ListingDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer bedrooms;
    private Integer bathrooms;

    @Enumerated(EnumType.STRING)
    private CompassDirection houseDirection;

    @Enumerated(EnumType.STRING)
    private CompassDirection balconyDirection;

    @Enumerated(EnumType.STRING)
    private LegalStatus legalStatus;

    @Enumerated(EnumType.STRING)
    private Furnishing furnishing;

    // Quan hệ 1-1 ngược lại với Post
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false, unique = true)
    private Post post;
}