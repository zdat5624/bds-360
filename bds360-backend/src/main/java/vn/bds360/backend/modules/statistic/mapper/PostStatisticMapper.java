package vn.bds360.backend.modules.statistic.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import vn.bds360.backend.modules.post.entity.Post;
import vn.bds360.backend.modules.statistic.dto.response.ManagePostStatisticsResponse.PostLogDto;

@Mapper(componentModel = "spring")
public interface PostStatisticMapper {

    @Mapping(target = "userName", source = "user.name")
    @Mapping(target = "listingType", source = "category.type")
    @Mapping(target = "vipLevel", source = "vip.vipLevel", defaultValue = "0")
    @Mapping(target = "views", source = "view") // Thêm dòng này để map view -> views
    @Mapping(target = "userAvatar", source = "user.avatar") // Thêm dòng này để map view -> views
    PostLogDto toPostLogDto(Post post);
}