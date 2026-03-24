package vn.bds360.backend.modules.address.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private long code;

    private String name;
    @JsonIgnore
    private String codename;
    @JsonProperty("division_type")
    private String divisionType;
    @JsonProperty("short_codename")
    @JsonIgnore
    private String shortCodename;

    @OneToMany(mappedBy = "district")
    @JsonIgnore
    private List<Post> post;

    @ManyToOne
    @JoinColumn(name = "province_code")
    @JsonIgnore
    private Province province;

    @OneToMany(mappedBy = "district", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Ward> wards;

}
