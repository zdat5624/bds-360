package vn.bds360.backend.common.exception;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.webmvc.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.bds360.backend.common.dto.response.ApiResponse;

@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<ApiResponse<Void>> handleError(HttpServletRequest request) {

        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        int statusCode = (status != null) ? Integer.parseInt(status.toString()) : 500;

        // Dùng Enum thay vì Hardcode String và Code
        if (statusCode == HttpStatus.NOT_FOUND.value()) {
            return buildErrorResponse(ErrorCode.API_NOT_FOUND);
        }

        if (statusCode == HttpStatus.FORBIDDEN.value()) {
            return buildErrorResponse(ErrorCode.FORBIDDEN);
        }

        if (statusCode == HttpStatus.UNAUTHORIZED.value()) {
            return buildErrorResponse(ErrorCode.UNAUTHORIZED);
        }

        return buildErrorResponse(ErrorCode.INTERNAL_ERROR);
    }

    private ResponseEntity<ApiResponse<Void>> buildErrorResponse(ErrorCode errorCode) {
        return ResponseEntity
                .status(errorCode.getStatus())
                .body(ApiResponse.error(errorCode.getCode(), errorCode.getMessage()));
    }
}