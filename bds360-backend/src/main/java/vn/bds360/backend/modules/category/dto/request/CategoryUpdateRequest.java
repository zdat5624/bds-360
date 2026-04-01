package vn.bds360.backend.modules.category.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.bds360.backend.common.constant.PostTypeEnum;

@Data
public class CategoryUpdateRequest {
    @NotNull(message = "ID_REQUIRED")
    private Long id;

    @NotBlank(message = "CATEGORY_NAME_REQUIRED")
    private String name;

    @NotNull(message = "CATEGORY_TYPE_REQUIRED")
    private PostTypeEnum type;
}