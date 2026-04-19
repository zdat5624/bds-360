package vn.bds360.backend.modules.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostViewChartResponse {
    private String date; // "YYYY-MM-DD"
    private Long views;
}