// vn/bds360/backend/modules/post/dto/response/NearbyLocationPriceResponse.java
package vn.bds360.backend.modules.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NearbyLocationPriceResponse {
    private Long locationCode;
    private String locationName;
    private Double avgPrice;
    private Long activePostsCount;
    private String locationType; // "WARD" hoặc "DISTRICT"
}