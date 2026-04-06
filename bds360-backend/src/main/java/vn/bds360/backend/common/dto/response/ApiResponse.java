package vn.bds360.backend.common.dto.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    public record FieldErrorDetail(String field, String message) {
    }

    @Schema(description = "Mã trạng thái API", requiredMode = Schema.RequiredMode.REQUIRED)
    private int code;

    @Schema(description = "Thông báo", requiredMode = Schema.RequiredMode.REQUIRED)
    private String message;

    @Schema(description = "Dữ liệu trả về")
    private T data;

    @Schema(description = "Chi tiết lỗi (nếu có)")
    private List<FieldErrorDetail> validationErrors;

    // ==========================================
    // KHAI BÁO HẰNG SỐ THÀNH CÔNG TẠI ĐÂY
    // ==========================================
    private static final int SUCCESS_CODE = 10000;
    private static final String SUCCESS_MESSAGE = "Thành công";

    // ==========================================
    // CÁC HÀM CHO LUỒNG THÀNH CÔNG
    // ==========================================
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .code(SUCCESS_CODE)
                .data(data)
                .message(message)
                .build();
    }

    public static <T> ApiResponse<T> success(T data) {
        return success(data, SUCCESS_MESSAGE); // Gắn cứng chữ "Thành công"
    }

    // ==========================================
    // CÁC HÀM CHO LUỒNG THẤT BẠI
    // ==========================================
    public static <T> ApiResponse<T> error(int code, String message) {
        return ApiResponse.<T>builder()
                .code(code)
                .message(message)
                .build();
    }

    public static <T> ApiResponse<T> error(int code, String message, List<FieldErrorDetail> errors) {
        return ApiResponse.<T>builder()
                .code(code)
                .message(message)
                .validationErrors(errors)
                .build();
    }
}