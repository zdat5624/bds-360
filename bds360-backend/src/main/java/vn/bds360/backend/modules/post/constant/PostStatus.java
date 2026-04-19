package vn.bds360.backend.modules.post.constant;

public enum PostStatus {
    PENDING, // Chờ duyệt
    REVIEW_LATER, // Duyệt sau (dành cho tin VIP cần kiểm tra kỹ hơn)
    APPROVED, // Đang hiển thị
    REJECTED, // Bị từ chối (trong quá trình duyệt lần đầu)
    EXPIRED, // Hết hạn hiển thị
    BLOCKED // Bị khóa (do Admin phát hiện vi phạm hoặc bị report sau khi đã APPROVED)
}