package vn.bds360.backend.common.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    public record FieldErrorDetail(String field, String message) {
    }

    private int code;
    private String message;
    private T data;
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