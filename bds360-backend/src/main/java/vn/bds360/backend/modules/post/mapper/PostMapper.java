// --- File: PostMapper.java ---
package vn.bds360.backend.modules.post.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import vn.bds360.backend.common.mapper.MapperConfiguration;
import vn.bds360.backend.modules.post.dto.request.PostCreateRequest;
import vn.bds360.backend.modules.post.dto.request.UpdatePostRequest;
import vn.bds360.backend.modules.post.dto.response.PostResponse;
import vn.bds360.backend.modules.post.entity.Post;

@Mapper(config = MapperConfiguration.class)
public interface PostMapper {

    @Mapping(target = "category.id", source = "categoryId")
    @Mapping(target = "province.code", source = "provinceCode")
    @Mapping(target = "district.code", source = "districtCode")
    @Mapping(target = "ward.code", source = "wardCode")
    @Mapping(target = "vip.id", source = "vipId")
    @Mapping(target = "images", ignore = true)
    Post toEntity(PostCreateRequest request);

    @Mapping(target = "provinceName", source = "province.name")
    @Mapping(target = "districtName", source = "district.name")
    @Mapping(target = "wardName", source = "ward.name")
    PostResponse toResponse(Post post);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "province", ignore = true)
    @Mapping(target = "district", ignore = true)
    @Mapping(target = "ward", ignore = true)
    void updateEntityFromRequest(UpdatePostRequest request, @MappingTarget Post post);
}