package vn.bds360.backend.common.util.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import vn.bds360.backend.modules.post.entity.Post;

public class PostRequestDTO {

    @Valid
    @NotNull(message = "Post không được null")
    private Post post;

    @Min(value = 1, message = "Số ngày phải lớn hơn 0")
    private int numberOfDays;

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public int getNumberOfDays() {
        return numberOfDays;
    }

    public void setNumberOfDays(int numberOfDays) {
        this.numberOfDays = numberOfDays;
    }

}
