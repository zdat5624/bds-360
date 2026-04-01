package vn.bds360.backend.modules.address.dto.response;

import lombok.Data;

@Data
public class WardResponse {
    private long code;
    private String name;
    private String divisionType;
}