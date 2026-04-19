// vn/bds360/backend/modules/post/dto/request/RelatedPostRequest.java
package vn.bds360.backend.modules.post.dto.request;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.dto.request.BaseFilterRequest;

@Getter
@Setter
public class RelatedPostRequest extends BaseFilterRequest {

    // Chỉ nhận duy nhất danh sách ID cần loại trừ từ Frontend
    private List<Long> excludeIds;

}