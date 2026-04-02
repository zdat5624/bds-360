package vn.bds360.backend.modules.category.dto.response;

import lombok.Data;
import vn.bds360.backend.common.constant.ListingType;

@Data
public class CategoryResponse {
    private Long id;
    private String name;
    private ListingType type;
}