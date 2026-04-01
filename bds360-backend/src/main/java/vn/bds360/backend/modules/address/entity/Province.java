package vn.bds360.backend.modules.address.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.modules.post.entity.Post;

@Getter
@Setter
@Entity
@Table(name = "provinces")
public class Province {

    @Id
    private long code;

    private String name;

    private String codename;

    @JsonProperty("division_type")
    private String divisionType;

    @JsonProperty("phone_code")
    private int phoneCode;

    @OneToMany(mappedBy = "province")
    private List<Post> post;

    @OneToMany(mappedBy = "province", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<District> districts;

}