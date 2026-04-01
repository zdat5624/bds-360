package vn.bds360.backend.modules.category.dto.request;

import lombok.Getter;
import lombok.Setter;
import vn.bds360.backend.common.constant.PostTypeEnum;
import vn.bds360.backend.common.dto.request.BaseFilterRequest;

@Getter
@Setter
public class CategoryFilterRequest extends BaseFilterRequest {
    // Thêm các tiêu chí lọc đặc thù của Category
    private String name;
    private PostTypeEnum type;
}