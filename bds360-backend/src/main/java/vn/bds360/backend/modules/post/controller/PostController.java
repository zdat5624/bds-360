package vn.bds360.backend.modules.post.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.common.dto.response.PageResponse;
import vn.bds360.backend.modules.post.dto.request.PostCreateRequest;
import vn.bds360.backend.modules.post.dto.request.PostFilterRequest;
import vn.bds360.backend.modules.post.dto.request.UpdatePostDTO;
import vn.bds360.backend.modules.post.dto.request.UpdatePostStatusDTO;
import vn.bds360.backend.modules.post.dto.response.PostResponse;
import vn.bds360.backend.modules.post.service.PostService;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.security.annotation.CurrentUser;
import vn.bds360.backend.security.annotation.IsAdmin;
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
    public ApiResponse<PostResponse> createPost(@CurrentUser User user, @Valid @RequestBody PostCreateRequest request) {
        return ApiResponse.success(postService.createPost(user, request), "Đăng tin thành công");
    }

    @PutMapping
    @RequireLogin
    public ApiResponse<PostResponse> updatePost(@CurrentUser User user, @Valid @RequestBody UpdatePostDTO request) {
        return ApiResponse.success(postService.updatePost(user, request), "Cập nhật tin đăng thành công");
    }

    @DeleteMapping("/{id}")
    @RequireLogin
    public ApiResponse<Void> deletePost(@CurrentUser User user, @PathVariable Long id) {
        postService.deletePost(user, id, false);
        return ApiResponse.success(null, "Xóa tin đăng thành công");
    }

    @GetMapping("/my-posts")
    @RequireLogin
    public ApiResponse<PageResponse<PostResponse>> getMyPosts(@CurrentUser User user, @Valid PostFilterRequest filter) {
        filter.setSearch(user.getEmail()); // Ép buộc chỉ tìm tin của chính user này
        filter.setIsDeleteByUser(false);
        return ApiResponse.success(postService.getFilteredPosts(filter));
    }

    // ==========================================
    // CÁC ENDPOINT CÔNG KHAI (PUBLIC)
    // ==========================================

    @GetMapping
    public ApiResponse<PageResponse<PostResponse>> getPublicPosts(@Valid PostFilterRequest filter) {
        filter.setIsApprovedOnly(true); // Public chỉ được xem tin đã duyệt
        filter.setIsDeleteByUser(false);
        return ApiResponse.success(postService.getFilteredPosts(filter), "Lấy danh sách tin đăng thành công");
    }

    @GetMapping("/{id}")
    public ApiResponse<PostResponse> getPostById(@CurrentUser User user, @PathVariable Long id) {
        // user có thể null nếu public user gọi, Service sẽ tự handle
        return ApiResponse.success(postService.getPostById(user, id), "Lấy chi tiết tin đăng thành công");
    }

    // ==========================================
    // ADMIN ENDPOINTS
    // ==========================================

    @GetMapping("/admin")
    @IsAdmin
    public ApiResponse<PageResponse<PostResponse>> getAdminPosts(@Valid PostFilterRequest filter) {
        return ApiResponse.success(postService.getFilteredPosts(filter));
    }

    @PutMapping("/admin/status")
    @IsAdmin
    public ApiResponse<PostResponse> updatePostStatus(@Valid @RequestBody UpdatePostStatusDTO dto) {
        return ApiResponse.success(postService.updatePostStatus(dto.getPostId(), dto.getStatus(), dto.getMessage(),
                dto.isSendNotification()));
    }

    @DeleteMapping("/admin/{id}")
    @IsAdmin
    public ApiResponse<Void> deletePostAdmin(@CurrentUser User admin, @PathVariable Long id) {
        postService.deletePost(admin, id, true); // true = Hard Delete
        return ApiResponse.success(null, "Quản trị viên đã xóa vĩnh viễn tin đăng");
    }
}