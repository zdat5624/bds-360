package vn.bds360.backend.modules.address.dto.request;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class DistrictDTO {
    private long code;
    private String name;
    private String codename;
    @JsonProperty("division_type")
    private String divisionType;
    @JsonProperty("short_codename")
    private String shortCodename;
    private List<WardDTO> wards;

}
