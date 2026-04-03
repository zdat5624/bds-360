package vn.bds360.backend.modules.address.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.modules.post.entity.Post;

@Getter
@Setter
@Entity
@Table(name = "districts")
public class District {

    @Id
    private Long code;

    private String name;

    private String codename;

    @JsonProperty("division_type")
    private String divisionType;

    @JsonProperty("short_codename")
    private String shortCodename;

    @OneToMany(mappedBy = "district")
    private List<Post> post;

    @ManyToOne
    @JoinColumn(name = "province_code")
    private Province province;

    @OneToMany(mappedBy = "district", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Ward> wards;

}
