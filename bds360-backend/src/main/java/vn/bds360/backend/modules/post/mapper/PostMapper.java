package vn.bds360.backend.modules.post.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import vn.bds360.backend.common.mapper.EntityResolver; // Import class vừa tạo
import vn.bds360.backend.common.mapper.MapperConfiguration;
import vn.bds360.backend.modules.post.dto.request.PostCreateRequest;
import vn.bds360.backend.modules.post.dto.request.UpdatePostRequest;
import vn.bds360.backend.modules.post.dto.response.PostResponse;
import vn.bds360.backend.modules.post.dto.response.SavedPostResponse;
import vn.bds360.backend.modules.post.entity.Post;
import vn.bds360.backend.modules.post.entity.SavedPost;

// Thêm uses = EntityResolver.class vào đây
@Mapper(config = MapperConfiguration.class, uses = { EntityResolver.class })
public interface PostMapper {

    @Mapping(target = "category", source = "categoryId", qualifiedByName = "toEntity")
    @Mapping(target = "province", source = "provinceCode", qualifiedByName = "toEntity")
    @Mapping(target = "district", source = "districtCode", qualifiedByName = "toEntity")
    @Mapping(target = "ward", source = "wardCode", qualifiedByName = "toEntity")
    @Mapping(target = "vip", source = "vipId", qualifiedByName = "toEntity")
    @Mapping(target = "images", ignore = true)
    Post toEntity(PostCreateRequest request);

    @Mapping(target = "provinceCode", source = "province.code")
    @Mapping(target = "provinceName", source = "province.name")
    @Mapping(target = "districtCode", source = "district.code")
    @Mapping(target = "districtName", source = "district.name")
    @Mapping(target = "wardCode", source = "ward.code")
    @Mapping(target = "wardName", source = "ward.name")
    PostResponse toResponse(Post post);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "listingDetail", ignore = true)
    @Mapping(target = "category", source = "categoryId", qualifiedByName = "toEntity")
    @Mapping(target = "province", source = "provinceCode", qualifiedByName = "toEntity")
    @Mapping(target = "district", source = "districtCode", qualifiedByName = "toEntity")
    @Mapping(target = "ward", source = "wardCode", qualifiedByName = "toEntity")
    void updateEntityFromRequest(UpdatePostRequest request, @MappingTarget Post post);

    @BeanMapping(builder = @Builder(disableBuilder = true))
    @Mapping(target = "savedAt", source = "savedAt")
    @Mapping(target = ".", source = "post")
    @Mapping(target = "provinceName", source = "post.province.name")
    @Mapping(target = "districtName", source = "post.district.name")
    @Mapping(target = "wardName", source = "post.ward.name")
    @Mapping(target = "provinceCode", source = "post.province.code")
    @Mapping(target = "districtCode", source = "post.district.code")
    @Mapping(target = "wardCode", source = "post.ward.code")
    SavedPostResponse toSavedPostResponse(SavedPost savedPost);
}