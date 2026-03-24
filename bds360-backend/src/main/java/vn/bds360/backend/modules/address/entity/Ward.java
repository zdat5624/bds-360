package vn.bds360.backend.modules.address.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
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
@Table(name = "wards")
public class Ward {

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

    @OneToMany(mappedBy = "ward")
    @JsonIgnore
    private List<Post> post;

    @ManyToOne
    @JoinColumn(name = "district_code")
    @JsonIgnore
    private District district;

}
