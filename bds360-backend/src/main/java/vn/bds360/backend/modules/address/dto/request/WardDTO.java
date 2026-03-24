package vn.bds360.backend.modules.address.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WardDTO {
    private long code;
    private String name;
    private String codename;
    @JsonProperty("division_type")
    private String divisionType;
    @JsonProperty("short_codename")
    private String shortCodename;

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

}