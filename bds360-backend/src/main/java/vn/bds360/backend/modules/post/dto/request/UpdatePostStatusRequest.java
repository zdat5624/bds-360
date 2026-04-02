package vn.bds360.backend.modules.post.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.bds360.backend.modules.post.constant.PostStatus;

@Data
public class UpdatePostStatusRequest {

    @NotNull(message = "ID tin đăng không được để trống")
    private long postId;

    @NotNull(message = "Trạng thái mới không được để trống")
    private PostStatus status;

    private String message;

    private boolean sendNotification = true;

}