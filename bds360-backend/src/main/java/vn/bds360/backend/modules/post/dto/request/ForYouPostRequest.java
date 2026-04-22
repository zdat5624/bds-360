// vn/bds360/backend/modules/post/dto/request/ForYouPostRequest.java
package vn.bds360.backend.modules.post.dto.request;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.ListingType;
import vn.bds360.backend.common.dto.request.BaseFilterRequest;

@Getter
@Setter
public class ForYouPostRequest extends BaseFilterRequest {
    // Cho phép Frontend lọc thêm: Gợi ý nhưng chỉ lấy tin BÁN (SALE) hoặc CHO THUÊ
    // (RENT)
    // Nếu Frontend không truyền (null), backend sẽ lấy cả 2 loại
    private ListingType type;

    private List<Long> excludeIds;
}