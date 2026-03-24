package vn.bds360.backend.modules.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MapPostDTO {
    private Double latitude;
    private Double longitude;
    private Long postId;
    private Long vipId;
    private Long price;
}