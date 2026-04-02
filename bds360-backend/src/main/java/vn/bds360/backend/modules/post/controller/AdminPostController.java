// --- File: AdminPostController.java ---
package vn.bds360.backend.modules.post.controller;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.common.dto.response.PageResponse;
import vn.bds360.backend.modules.post.dto.request.PostFilterRequest;
import vn.bds360.backend.modules.post.dto.request.UpdatePostStatusRequest;
import vn.bds360.backend.modules.post.dto.response.PostResponse;
import vn.bds360.backend.modules.post.service.PostService;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.security.annotation.CurrentUser;
import vn.bds360.backend.security.annotation.IsAdmin;

@RestController
@RequestMapping("/api/v1/admin/posts")
@RequiredArgsConstructor
@Validated
@IsAdmin
public class AdminPostController {

    private final PostService postService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<PageResponse<PostResponse>> getAdminPosts(@Valid PostFilterRequest filter) {
        return ApiResponse.success(postService.getFilteredPosts(filter));
    }

    @PutMapping("/status")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<PostResponse> updatePostStatus(@Valid @RequestBody UpdatePostStatusRequest dto) {
        return ApiResponse.success(postService.updatePostStatus(
                dto.getPostId(),
                dto.getStatus(),
                dto.getMessage(),
                dto.isSendNotification()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Void> deletePostAdmin(@CurrentUser User admin, @PathVariable Long id) {
        postService.deletePost(admin, id, true);
        return ApiResponse.success(null, "Quản trị viên đã xóa vĩnh viễn tin đăng");
    }
}