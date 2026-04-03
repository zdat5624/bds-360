package vn.bds360.backend.modules.post.entity;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.ListingType;
import vn.bds360.backend.modules.address.entity.District;
import vn.bds360.backend.modules.address.entity.Province;
import vn.bds360.backend.modules.address.entity.Ward;
import vn.bds360.backend.modules.category.entity.Category;
import vn.bds360.backend.modules.post.constant.PostStatus;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.vip.entity.Vip;
import vn.bds360.backend.security.SecurityUtil;

@Getter
@Setter
@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 255, message = "Tiêu đề không được quá 255 ký tự")
    private String title;

    @Column(columnDefinition = "MEDIUMTEXT")
    @NotBlank(message = "Mô tả không được để trống")
    private String description;

    private Boolean notifyOnView;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Loại tin đăng không được để trống")
    private ListingType type;

    @NotNull(message = "Giá không được để trống")
    @Min(value = 0, message = "Giá phải lớn hơn hoặc bằng 0")
    private Long price;

    @NotNull(message = "Diện tích không được để trống")
    @DecimalMin(value = "0.1", message = "Diện tích phải lớn hơn 0")
    private Double area;

    @Min(value = 0, message = "Lượt xem phải không âm")
    private Long view = 0L;

    @Enumerated(EnumType.STRING)
    private PostStatus status;

    private Instant expireDate;
    private Boolean deletedByUser;

    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;

    @ManyToOne
    @JoinColumn(name = "province_code")
    @NotNull(message = "Tỉnh/Thành phố không được để trống")
    private Province province;

    @ManyToOne
    @JoinColumn(name = "district_code")
    @NotNull(message = "Quận/Huyện không được để trống")
    private District district;

    @ManyToOne
    @JoinColumn(name = "ward_code")
    private Ward ward;

    @Size(max = 255, message = "Địa chỉ chi tiết không được quá 255 ký tự")
    @NotNull
    private String streetAddress;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @NotNull(message = "Danh mục không được để trống")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "vip_id")
    private Vip vip;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Image> images;

    @OneToOne(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private ListingDetail listingDetail;

    @PrePersist
    public void handleBeforeCreate() {
        if (this.createdBy == null) {
            this.createdBy = SecurityUtil.getCurrentUserLogin().orElse("");
        }

        this.createdAt = Instant.now();
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        this.updatedBy = SecurityUtil.getCurrentUserLogin().orElse("");
        this.updatedAt = Instant.now();
    }

}
