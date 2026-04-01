package vn.bds360.backend.modules.address.dto.request;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ProvinceDTO {

    private long code;
    private String name;
    private String codename;
    @JsonProperty("division_type")
    private String divisionType;
    @JsonProperty("phone_code")
    private int phoneCode;

    private List<DistrictDTO> districts;

}