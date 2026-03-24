package vn.bds360.backend.modules.address.dto.request;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DistrictDTO {
    private long code;
    private String name;
    private String codename;
    @JsonProperty("division_type")
    private String divisionType;
    @JsonProperty("short_codename")
    private String shortCodename;
    private List<WardDTO> wards;

    public long getCode() {
        return code;
    }

    public void setCode(long code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCodename() {
        return codename;
    }

    public void setCodename(String codename) {
        this.codename = codename;
    }

    public String getDivisionType() {
        return divisionType;
    }

    public void setDivisionType(String divisionType) {
        this.divisionType = divisionType;
    }

    public String getShortCodename() {
        return shortCodename;
    }

    public void setShortCodename(String shortCodename) {
        this.shortCodename = shortCodename;
    }

    public List<WardDTO> getWards() {
        return wards;
    }

    public void setWards(List<WardDTO> wards) {
        this.wards = wards;
    }

}
