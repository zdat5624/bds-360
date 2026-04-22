package vn.bds360.backend.modules.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MapPostResponse {
    private Double latitude;
    private Double longitude;
    private Long postId;
    private Long vipId;
    private Long price;
}