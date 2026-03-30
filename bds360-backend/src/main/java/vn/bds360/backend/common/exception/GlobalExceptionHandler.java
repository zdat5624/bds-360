package vn.bds360.backend.common.exception;

import java.util.List;

import org.springframework.data.core.PropertyReferenceException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import lombok.extern.slf4j.Slf4j;
import vn.bds360.backend.common.dto.response.ApiResponse;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

        // =========================================================================
        // 1. HỨNG LỖI VALIDATION (@Valid / @Validated)
        // =========================================================================
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex) {
                List<ApiResponse.FieldErrorDetail> errors = ex.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .map(err -> new ApiResponse.FieldErrorDetail(err.getField(), err.getDefaultMessage()))
                                .toList();

                return ResponseEntity
                                .status(ErrorCode.VALIDATION_ERROR.getStatus())
                                .body(ApiResponse.error(
                                                ErrorCode.VALIDATION_ERROR.getCode(),
                                                ErrorCode.VALIDATION_ERROR.getMessage(),
                                                errors));
        }

        // =========================================================================
        // 2. HỨNG LỖI NGHIỆP VỤ CHỦ ĐỘNG (AppException)
        // =========================================================================
        @ExceptionHandler(AppException.class)
        public ResponseEntity<ApiResponse<Void>> handleAppException(AppException ex) {
                ErrorCode errorCode = ex.getErrorCode();

                return ResponseEntity
                                .status(errorCode.getStatus())
                                .body(ApiResponse.error(errorCode.getCode(), errorCode.getMessage()));
        }

        // =========================================================================
        // 3. HỨNG LỖI SAI ĐỊNH DẠNG JSON (Vd: Gửi chữ vào trường số nguyên)
        // =========================================================================
        @ExceptionHandler(HttpMessageNotReadableException.class)
        public ResponseEntity<ApiResponse<Void>> handleHttpMessageNotReadableException(
                        HttpMessageNotReadableException ex) {
                log.warn("Lỗi parse JSON từ Client: {}", ex.getMessage());

                // Tái sử dụng HTTP Status 400 của VALIDATION_ERROR nhưng ghi đè lời nhắn
                return ResponseEntity
                                .status(ErrorCode.VALIDATION_ERROR.getStatus())
                                .body(ApiResponse.error(
                                                ErrorCode.VALIDATION_ERROR.getCode(),
                                                "Định dạng dữ liệu gửi lên không hợp lệ (Sai cấu trúc JSON hoặc sai kiểu dữ liệu)."));
        }

        // =========================================================================
        // 4. HỨNG LỖI SAI QUYỀN TRUY CẬP (Spring Security @PreAuthorize)
        // =========================================================================
        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(AccessDeniedException ex) {
                log.warn("Cảnh báo bảo mật - Truy cập trái phép: {}", ex.getMessage());

                // 👉 ĐÃ SỬA: Gọi trực tiếp ErrorCode.FORBIDDEN thay vì hardcode 40300
                ErrorCode errorCode = ErrorCode.FORBIDDEN;
                return ResponseEntity
                                .status(errorCode.getStatus())
                                .body(ApiResponse.error(errorCode.getCode(), errorCode.getMessage()));
        }

        // =========================================================================
        // HỨNG LỖI THAM SỐ TRUYỀN VÀO (URL PARAM, PATH VARIABLE) - Mã 400
        // Bao gồm: Thiếu param, Sai kiểu dữ liệu (Vd: chữ truyền vào số)
        // =========================================================================
        @ExceptionHandler({
                        org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class,
                        org.springframework.web.bind.MissingServletRequestParameterException.class,
                        jakarta.validation.ConstraintViolationException.class // Lỗi khi dùng @Validated trên param
        })
        public ResponseEntity<ApiResponse<Void>> handleParameterException(Exception ex) {
                log.warn("Lỗi tham số Request: {}", ex.getMessage());
                return ResponseEntity
                                .status(ErrorCode.INVALID_PARAMETER.getStatus())
                                .body(ApiResponse.error(
                                                ErrorCode.INVALID_PARAMETER.getCode(),
                                                ErrorCode.INVALID_PARAMETER.getMessage()));
        }

        // =========================================================================
        // HỨNG LỖI SAI METHOD HTTP (GET, POST, PUT, DELETE) - Mã 405
        // =========================================================================
        @ExceptionHandler(org.springframework.web.HttpRequestMethodNotSupportedException.class)
        public ResponseEntity<ApiResponse<Void>> handleMethodNotSupportedException(
                        org.springframework.web.HttpRequestMethodNotSupportedException ex) {
                log.warn("Sai HTTP Method: {}", ex.getMessage());
                return ResponseEntity
                                .status(ErrorCode.METHOD_NOT_ALLOWED.getStatus())
                                .body(ApiResponse.error(
                                                ErrorCode.METHOD_NOT_ALLOWED.getCode(),
                                                ErrorCode.METHOD_NOT_ALLOWED.getMessage()));
        }

        @ExceptionHandler(NoHandlerFoundException.class)
        public ResponseEntity<ApiResponse<Void>> handleNoHandler(NoHandlerFoundException ex) {
                ErrorCode error = ErrorCode.API_NOT_FOUND;
                return ResponseEntity.status(error.getStatus())
                                .body(ApiResponse.error(error.getCode(), error.getMessage()));
        }

        @ExceptionHandler(NoResourceFoundException.class)
        public ResponseEntity<ApiResponse<Void>> handleNoResource(NoResourceFoundException ex) {
                ErrorCode error = ErrorCode.RESOURCE_NOT_FOUND;
                return ResponseEntity.status(error.getStatus())
                                .body(ApiResponse.error(error.getCode(), error.getMessage()));
        }

        // ==========================================
        // BẮT LỖI UPLOAD FILE QUÁ DUNG LƯỢNG
        // ==========================================
        @ExceptionHandler(MaxUploadSizeExceededException.class)
        public ResponseEntity<ApiResponse<Void>> handleMaxUploadSizeException(MaxUploadSizeExceededException e) {

                ErrorCode errorCode = ErrorCode.FILE_TOO_LARGE;

                return ResponseEntity
                                .status(errorCode.getStatus())
                                .body(ApiResponse.error(errorCode.getCode(), errorCode.getMessage()));
        }

        @ExceptionHandler(PropertyReferenceException.class)
        public ResponseEntity<ApiResponse<Void>> handlePropertyReferenceException(PropertyReferenceException e) {
                String badProperty = e.getPropertyName();
                log.warn("Lỗi sắp xếp: Không tìm thấy trường '{}'", badProperty);

                ErrorCode errorCode = ErrorCode.INVALID_SORT_FIELD;

                String dynamicMessage = String.format(errorCode.getMessage(), badProperty);

                // 3. Trả về
                return ResponseEntity
                                .status(errorCode.getStatus())
                                .body(ApiResponse.error(errorCode.getCode(), dynamicMessage));
        }

        // =========================================================================
        // 5. HỨNG MỌI LỖI HỆ THỐNG KHÔNG XÁC ĐỊNH (Catch-all)
        // =========================================================================
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiResponse<Void>> handleUnwantedException(Exception ex) {
                // BẮT BUỘC: In log lỗi thật (Stack trace) ra console để Dev còn biết đường fix
                log.error("Lỗi hệ thống (500): ", ex);

                // Trả về Frontend câu thông báo chung chung lấy từ ErrorCode
                return ResponseEntity
                                .status(ErrorCode.INTERNAL_ERROR.getStatus())
                                .body(ApiResponse.error(
                                                ErrorCode.INTERNAL_ERROR.getCode(),
                                                ErrorCode.INTERNAL_ERROR.getMessage()));
        }
}