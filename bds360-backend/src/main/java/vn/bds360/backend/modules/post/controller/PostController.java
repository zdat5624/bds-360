package vn.bds360.backend.modules.post.controller;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.common.dto.response.PageResponse;
import vn.bds360.backend.modules.post.dto.request.PostCreateRequest;
import vn.bds360.backend.modules.post.dto.request.PostFilterRequest;
import vn.bds360.backend.modules.post.dto.request.UpdatePostRequest;
import vn.bds360.backend.modules.post.dto.response.PostResponse;
import vn.bds360.backend.modules.post.service.PostService;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.security.annotation.CurrentUser;
import vn.bds360.backend.security.annotation.RequireLogin;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
@Validated
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

    @DeleteMapping("/{id}")
    @RequireLogin
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Void> deletePost(@CurrentUser User user, @PathVariable Long id) {
        postService.deletePost(user, id, false);
        return ApiResponse.success(null, "Xóa tin đăng thành công");
    }

    @GetMapping("/my-posts")
    @RequireLogin
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<PageResponse<PostResponse>> getMyPosts(@CurrentUser User user, @Valid PostFilterRequest filter) {
        filter.setSearch(user.getEmail()); // Ép buộc chỉ tìm tin của chính user này
        filter.setIsDeleteByUser(false);
        return ApiResponse.success(postService.getFilteredPosts(filter));
    }

    // ==========================================
    // CÁC ENDPOINT CÔNG KHAI (PUBLIC)
    // ==========================================

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<PageResponse<PostResponse>> getPublicPosts(@Valid PostFilterRequest filter) {
        filter.setIsApprovedOnly(true); // Public chỉ được xem tin đã duyệt
        filter.setIsDeleteByUser(false);
        return ApiResponse.success(postService.getFilteredPosts(filter), "Lấy danh sách tin đăng thành công");
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<PostResponse> getPostById(@CurrentUser User user, @PathVariable Long id) {
        // user có thể null nếu public user gọi, Service sẽ tự handle
        return ApiResponse.success(postService.getPostById(user, id), "Lấy chi tiết tin đăng thành công");
    }

}