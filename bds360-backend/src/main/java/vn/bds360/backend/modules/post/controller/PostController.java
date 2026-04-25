package vn.bds360.backend.modules.post.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.annotation.ApiGlobalResponse;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.common.dto.response.PageResponse;
import vn.bds360.backend.modules.post.constant.PostStatus;
import vn.bds360.backend.modules.post.dto.request.ForYouPostRequest;
import vn.bds360.backend.modules.post.dto.request.PostCreateRequest;
import vn.bds360.backend.modules.post.dto.request.PostFilterRequest;
import vn.bds360.backend.modules.post.dto.request.RelatedPostRequest;
import vn.bds360.backend.modules.post.dto.request.UpdatePostRequest;
import vn.bds360.backend.modules.post.dto.response.MapPostResponse;
import vn.bds360.backend.modules.post.dto.response.PostResponse;
import vn.bds360.backend.modules.post.service.PostService;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.security.annotation.CurrentUser;
import vn.bds360.backend.security.annotation.RequireLogin;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
@Validated
@ApiGlobalResponse
@Tag(name = "posts", description = "Quản lý bài đăng")
public class PostController {

    private final PostService postService;

    // ==========================================
    // CÁC ENDPOINT CHO NGƯỜI DÙNG ĐĂNG NHẬP
    // ==========================================

    @PostMapping
    @RequireLogin
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<PostResponse> createPost(@CurrentUser User user, @Valid @RequestBody PostCreateRequest request) {
        return ApiResponse.success(postService.createPost(user, request), "Đăng tin thành công");
    }

    @PutMapping
    @RequireLogin
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<PostResponse> updatePost(@CurrentUser User user, @Valid @RequestBody UpdatePostRequest request) {
        return ApiResponse.success(postService.updatePost(user, request), "Cập nhật tin đăng thành công");
    }

    @GetMapping("/my-posts")
    @RequireLogin
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<PageResponse<PostResponse>> getMyPosts(@CurrentUser User user, @Valid PostFilterRequest filter) {

        if (filter.getStatuses() != null && !filter.getStatuses().isEmpty()) {
            if (filter.getStatuses().contains(PostStatus.APPROVED)) {
                List<PostStatus> newStatuses = new ArrayList<>(filter.getStatuses());
                if (!newStatuses.contains(PostStatus.REVIEW_LATER)) {
                    newStatuses.add(PostStatus.REVIEW_LATER);
                }
                filter.setStatuses(newStatuses);
            }
        }

        // 🌟 GỌI HÀM RIÊNG CHO MY POSTS
        return ApiResponse.success(postService.getMyPosts(user, filter));
    }

    // ==========================================
    // CÁC ENDPOINT CÔNG KHAI (PUBLIC)
    // ==========================================

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<PageResponse<PostResponse>> getPublicPosts(@Valid PostFilterRequest filter) {
        // 🌟 GỌI HÀM RIÊNG CHO PUBLIC POSTS
        return ApiResponse.success(postService.getPublicPosts(filter), "Lấy danh sách tin đăng thành công");
    }

    @GetMapping("/for-you")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<PageResponse<PostResponse>> getForYouPosts(
            @CurrentUser User user,
            @Valid ForYouPostRequest request) {

        System.out.println(">>> log here");

        return ApiResponse.success(postService.getForYouPosts(user, request),
                "Lấy danh sách tin dành cho bạn thành công");
    }

    @GetMapping("/map")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<MapPostResponse>> getPostsForMap(@Valid PostFilterRequest filter) {
        return ApiResponse.success(postService.getPostsForMap(filter), "Lấy danh sách bản đồ thành công");
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<PostResponse> getPostById(@CurrentUser User user, @PathVariable Long id) {
        // user có thể null nếu public user gọi, Service sẽ tự handle
        return ApiResponse.success(postService.getPostById(user, id), "Lấy chi tiết tin đăng thành công");
    }

    @GetMapping("/{id}/related")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<PageResponse<PostResponse>> getRelatedPosts(
            @PathVariable Long id,
            @Valid RelatedPostRequest request) {
        return ApiResponse.success(postService.getRelatedPosts(id, request), "Lấy danh sách tin tương tự thành công");
    }

    @DeleteMapping("/{id}")
    @RequireLogin
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Void> deletePost(@CurrentUser User user, @PathVariable Long id) {
        postService.deletePost(user, id, false);
        return ApiResponse.success(null, "Xóa tin đăng thành công");
    }

    @PutMapping("/{id}/visibility")
    @RequireLogin
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<PostResponse> togglePostVisibility(
            @CurrentUser User user,
            @PathVariable Long id,
            @RequestParam boolean isHidden) {

        // Gọi xuống Service để xử lý logic
        PostResponse updatedPost = postService.togglePostVisibility(user, id, isHidden);

        // Trả về message linh hoạt tùy thuộc vào hành động Ẩn hay Hiện
        String message = isHidden ? "Đã tạm ẩn tin đăng" : "Đã hiển thị lại tin đăng";

        return ApiResponse.success(updatedPost, message);
    }

    @PutMapping("/{id}/renew")
    @RequireLogin
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<PostResponse> renewPost(
            @CurrentUser User user,
            @PathVariable Long id,
            @Valid @RequestBody vn.bds360.backend.modules.post.dto.request.RenewPostRequest request) {
        return ApiResponse.success(postService.renewPost(user, id, request), "Gia hạn tin đăng thành công");
    }

    @PutMapping("/{id}/bump")
    @RequireLogin
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<PostResponse> bumpPost(
            @CurrentUser User user,
            @PathVariable Long id) {
        return ApiResponse.success(postService.bumpPost(user, id), "Đẩy tin thành công");
    }

}