package vn.bds360.backend.common.util.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CoordinateResponse {
    private double latitude;
    private double longitude;

}
