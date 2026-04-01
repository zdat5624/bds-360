package vn.bds360.backend.modules.category.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import vn.bds360.backend.common.mapper.MapperConfiguration;
import vn.bds360.backend.modules.category.dto.request.CategoryCreateRequest;
import vn.bds360.backend.modules.category.dto.request.CategoryUpdateRequest;
import vn.bds360.backend.modules.category.dto.response.CategoryResponse;
import vn.bds360.backend.modules.category.entity.Category;

@Mapper(config = MapperConfiguration.class)
public interface CategoryMapper {

    Category toCategory(CategoryCreateRequest request);

    CategoryResponse toResponse(Category category);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "posts", ignore = true)
    void updateEntityFromRequest(CategoryUpdateRequest request, @MappingTarget Category category);
}