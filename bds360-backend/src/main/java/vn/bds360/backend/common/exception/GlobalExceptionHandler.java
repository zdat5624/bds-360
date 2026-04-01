package vn.bds360.backend.common.exception;

import java.util.List;

import org.springframework.data.core.PropertyReferenceException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import vn.bds360.backend.common.dto.response.ApiResponse;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex) {
                List<ApiResponse.FieldErrorDetail> errors = ex.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .map(err -> new ApiResponse.FieldErrorDetail(err.getField(), err.getDefaultMessage()))
                                .toList();
                ErrorCode e = ErrorCode.VALIDATION_ERROR;
                return ResponseEntity
                                .status(e.getStatus())
                                .body(ApiResponse.error(e.getCode(),
                                                e.getMessage(), errors));
        }

        @ExceptionHandler(AppException.class)
        public ResponseEntity<ApiResponse<Void>> handleAppException(AppException exception) {
                ErrorCode e = exception.getErrorCode();

                return ResponseEntity
                                .status(e.getStatus())
                                .body(ApiResponse.error(e.getCode(), e.getMessage()));
        }

        @ExceptionHandler(HttpMessageNotReadableException.class)
        public ResponseEntity<ApiResponse<Void>> handleHttpMessageNotReadableException(
                        HttpMessageNotReadableException exception) {
                log.warn("Lỗi parse JSON từ Client: {}", exception.getMessage());
                ErrorCode e = ErrorCode.INVALID_PARAMETER;
                return ResponseEntity
                                .status(e.getStatus())
                                .body(ApiResponse.error(e.getCode(), e.getMessage()));
        }

        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(AccessDeniedException exception) {
                log.warn("Cảnh báo bảo mật - Truy cập trái phép: {}", exception.getMessage());

                ErrorCode errorCode = ErrorCode.FORBIDDEN;
                return ResponseEntity
                                .status(errorCode.getStatus())
                                .body(ApiResponse.error(errorCode.getCode(), errorCode.getMessage()));
        }

        @ExceptionHandler({
                        MethodArgumentTypeMismatchException.class,
                        MissingServletRequestParameterException.class,
                        ConstraintViolationException.class
        })
        public ResponseEntity<ApiResponse<Void>> handleParameterException(Exception exception) {
                log.warn("Lỗi tham số Request: {}", exception.getMessage());
                ErrorCode e = ErrorCode.INVALID_PARAMETER;
                return ResponseEntity
                                .status(e.getStatus())
                                .body(ApiResponse.error(e.getCode(), e.getMessage()));
        }

        @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
        public ResponseEntity<ApiResponse<Void>> handleMethodNotSupportedException(
                        HttpRequestMethodNotSupportedException ex) {
                log.warn("Sai HTTP Method: {}", ex.getMessage());
                ErrorCode e = ErrorCode.METHOD_NOT_ALLOWED;
                return ResponseEntity
                                .status(e.getStatus())
                                .body(ApiResponse.error(e.getCode(), e.getMessage()));
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

                return ResponseEntity
                                .status(errorCode.getStatus())
                                .body(ApiResponse.error(errorCode.getCode(), dynamicMessage));
        }

        @ExceptionHandler(MultipartException.class)
        public ResponseEntity<ApiResponse<Void>> handleMultipartException(MultipartException e) {
                ErrorCode errorCode = ErrorCode.MISSING_FILE;
                return ResponseEntity.status(errorCode.getStatus())
                                .body(ApiResponse.error(errorCode.getCode(), errorCode.getMessage()));
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiResponse<Void>> handleUnwantedException(Exception ex) {
                log.error("Lỗi hệ thống (500): ", ex);
                ErrorCode e = ErrorCode.INTERNAL_ERROR;
                return ResponseEntity
                                .status(e.getStatus())
                                .body(ApiResponse.error(
                                                e.getCode(),
                                                e.getMessage()));
        }
}