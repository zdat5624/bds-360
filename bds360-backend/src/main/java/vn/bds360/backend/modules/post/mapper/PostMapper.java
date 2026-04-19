package vn.bds360.backend.modules.post.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import vn.bds360.backend.common.mapper.MapperConfiguration;
import vn.bds360.backend.modules.post.dto.request.PostCreateRequest;
import vn.bds360.backend.modules.post.dto.request.UpdatePostRequest;
import vn.bds360.backend.modules.post.dto.response.PostResponse;
import vn.bds360.backend.modules.post.dto.response.SavedPostResponse;
import vn.bds360.backend.modules.post.entity.Post;
import vn.bds360.backend.modules.post.entity.SavedPost;

@Mapper(config = MapperConfiguration.class)
public interface PostMapper {

    @Mapping(target = "category.id", source = "categoryId")
    @Mapping(target = "province.code", source = "provinceCode")
    @Mapping(target = "district.code", source = "districtCode")
    @Mapping(target = "ward.code", source = "wardCode")
    @Mapping(target = "vip.id", source = "vipId")
    @Mapping(target = "images", ignore = true)
    Post toEntity(PostCreateRequest request);

    @Mapping(target = "provinceCode", source = "province.code")
    @Mapping(target = "provinceName", source = "province.name")
    @Mapping(target = "districtCode", source = "district.code")
    @Mapping(target = "districtName", source = "district.name")
    @Mapping(target = "wardCode", source = "ward.code")
    @Mapping(target = "wardName", source = "ward.name")
    PostResponse toResponse(Post post);

    @Mapping(target = "id", ignore = true) // Không bao giờ map đè ID của Entity
    @Mapping(target = "images", ignore = true) // Ảnh xử lý thủ công trong Service
    @Mapping(target = "category.id", source = "categoryId")
    @Mapping(target = "province.code", source = "provinceCode")
    @Mapping(target = "district.code", source = "districtCode")
    @Mapping(target = "ward.code", source = "wardCode")
    @Mapping(target = "listingDetail", ignore = true) // Detail xử lý thủ công
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