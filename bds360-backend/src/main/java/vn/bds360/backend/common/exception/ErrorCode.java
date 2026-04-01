package vn.bds360.backend.common.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public enum ErrorCode {

    // ==========================================
    // 10. COMMON & SYSTEM (Core)
    // ==========================================
    INTERNAL_ERROR(10001, HttpStatus.INTERNAL_SERVER_ERROR, "Sự cố hệ thống máy chủ."),
    VALIDATION_ERROR(10002, HttpStatus.BAD_REQUEST, "Dữ liệu đầu vào không hợp lệ."),
    INVALID_PARAMETER(10003, HttpStatus.BAD_REQUEST, "Tham số truyền vào thiếu hoặc không hợp lệ."),
    UNAUTHORIZED(10004, HttpStatus.UNAUTHORIZED, "Chưa xác thực hoặc token không hợp lệ."),
    FORBIDDEN(10005, HttpStatus.FORBIDDEN, "Bạn không có quyền truy cập vào tài nguyên này."),
    API_NOT_FOUND(10006, HttpStatus.NOT_FOUND, "Đường dẫn API không tồn tại trên hệ thống."),
    METHOD_NOT_ALLOWED(10007, HttpStatus.METHOD_NOT_ALLOWED, "Phương thức HTTP không được hỗ trợ."),
    RESOURCE_NOT_FOUND(10008, HttpStatus.NOT_FOUND, "Tài nguyên tĩnh không tồn tại hoặc URL sai."),
    INVALID_SORT_FIELD(10009, HttpStatus.BAD_REQUEST, "Không thể sắp xếp. Trường dữ liệu '%s' không tồn tại."),
    MISSING_FILE(10010, HttpStatus.BAD_REQUEST, "Request không chứa file hoặc sai định dạng multipart/form-data."),

    // ==========================================
    // 11. AUTH & USER MODULE
    // ==========================================
    USER_NOT_FOUND(11001, HttpStatus.NOT_FOUND, "Không tìm thấy người dùng trong hệ thống."),
    USER_EXISTED(11002, HttpStatus.CONFLICT, "Email hoặc số điện thoại đã tồn tại."),
    USER_LOCKED(11003, HttpStatus.FORBIDDEN, "Tài khoản của bạn đã bị khóa."),
    WRONG_PASSWORD(11004, HttpStatus.BAD_REQUEST, "Mật khẩu không chính xác."),
    INVALID_CREDENTIALS(11005, HttpStatus.UNAUTHORIZED, "Tài khoản hoặc mật khẩu không chính xác."),
    TOKEN_EXPIRED(11006, HttpStatus.UNAUTHORIZED, "Token đã hết hạn, vui lòng đăng nhập lại."),
    INVALID_OTP_CODE(11007, HttpStatus.BAD_REQUEST, "Mã xác nhận không chính xác hoặc không tồn tại."),
    CANNOT_DELETE_ADMIN(11008, HttpStatus.BAD_REQUEST, "Không thể xóa tài khoản ADMIN."),
    // ==========================================
    // 12. POST & CATEGORY MODULE (Bất động sản)
    // ==========================================
    POST_NOT_FOUND(12001, HttpStatus.NOT_FOUND, "Không tìm thấy bài đăng bất động sản."),
    POST_STATUS_INVALID(12002, HttpStatus.BAD_REQUEST, "Trạng thái bài đăng không hợp lệ để thao tác."),
    CATEGORY_NOT_FOUND(12003, HttpStatus.NOT_FOUND, "Không tìm thấy danh mục bất động sản."),

    // ==========================================
    // 13. ADDRESS MODULE (Tọa độ, Bản đồ)
    // ==========================================
    ADDRESS_NOT_FOUND(13001, HttpStatus.NOT_FOUND, "Không tìm thấy thông tin địa chỉ."),
    GEOCODE_FAILED(13002, HttpStatus.BAD_REQUEST, "Không thể lấy tọa độ từ hệ thống bản đồ."),

    // ==========================================
    // 14. TRANSACTION MODULE (Thanh toán VNPAY)
    // ==========================================
    TRANSACTION_NOT_FOUND(14001, HttpStatus.NOT_FOUND, "Không tìm thấy giao dịch này."),
    PAYMENT_FAILED(14002, HttpStatus.BAD_REQUEST, "Thanh toán thất bại hoặc đã bị hủy."),
    BALANCE_NOT_ENOUGH(14003, HttpStatus.BAD_REQUEST, "Số dư trong tài khoản không đủ để thực hiện."),

    // ==========================================
    // 15. VIP MODULE (Gói thành viên)
    // ==========================================
    VIP_NOT_FOUND(15001, HttpStatus.NOT_FOUND, "Không tìm thấy gói VIP này."),

    // ==========================================
    // 16. MEDIA MODULE (Hình ảnh)
    // ==========================================
    FILE_TOO_LARGE(16001, HttpStatus.CONTENT_TOO_LARGE, "Kích thước file vượt quá mức cho phép."),
    FILE_FORMAT_INVALID(16002, HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Định dạng file không được hỗ trợ."),
    FILE_UPLOAD_FAILED(16003, HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi hệ thống trong quá trình lưu trữ file.");

    // ------------------------------------------
    // FIELDS & CONSTRUCTORS
    // ------------------------------------------
    private final int code;
    private final HttpStatus status;
    private final String message;

    ErrorCode(int code, HttpStatus status, String message) {
        this.code = code;
        this.status = status;
        this.message = message;
    }
}