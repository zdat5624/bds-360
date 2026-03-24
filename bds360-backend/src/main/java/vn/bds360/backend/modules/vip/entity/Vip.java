package vn.bds360.backend.modules.vip.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.modules.post.entity.Post;

@Getter
@Setter
@Entity
@Table(name = "vips")
public class Vip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private int vipLevel;

    @NotBlank(message = "Name không được để trống")
    private String name;

    private long pricePerDay;

    @OneToMany(mappedBy = "vip")
    @JsonIgnore
    private List<Post> posts;

    public Vip(int vipLevel,
            @NotBlank(message = "Name không được để trống") String name,
            long pricePerDay) {
        this.vipLevel = vipLevel;
        this.name = name;
        this.pricePerDay = pricePerDay;
    }

    public Vip() {
    }

}
