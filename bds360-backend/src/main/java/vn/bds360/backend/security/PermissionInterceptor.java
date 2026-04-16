package vn.bds360.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vn.bds360.backend.common.constant.Role;
import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.service.UserService;

@Component
public class PermissionInterceptor implements HandlerInterceptor {

    @Autowired
    UserService userService;

    @Override
    @Transactional
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String path = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        String httpMethod = request.getMethod();

        // 1. Nếu không tìm thấy path (tránh NPE) hoặc là request OPTIONS (CORS), cho
        // qua
        if (path == null || "OPTIONS".equals(httpMethod)) {
            return true;
        }

        System.out.println(">>> RUN preHandle: " + path);

        // 2. Cho phép các API public đi qua Interceptor mà không cần check User
        // Bạn nên loại trừ các path đã permitAll trong SecurityConfiguration
        if (path.startsWith("/api/v1/auth") && !path.equals("/api/v1/auth/account")) {
            return true;
        }
        // Các đường dẫn public khác...
        if (path.startsWith("/v3/api-docs") || path.startsWith("/swagger-ui")) {
            return true;
        }

        // 3. Lấy email
        String email = SecurityService.getCurrentUserLogin().orElse("");

        // Chỉ check login nếu không phải là các đường dẫn được bỏ qua ở trên
        if (email.isEmpty()) {
            // Nếu API yêu cầu login (như /account) mà không có email thì mới throw
            // Tuy nhiên, tốt nhất là để Spring Security xử lý 401.
            // Interceptor chỉ nên xử lý phân quyền (Authorization).
            return true;
        }

        User user = userService.handleGetUserByUserName(email);
        if (user == null || user.getRole() == null) {
            return true; // Để Filter của Spring Security xử lý lỗi Auth
        }

        Role role = user.getRole();

        // 4. Kiểm tra quyền Admin (Sửa /api/admin thành /api/v1/admin cho đúng thực tế)
        if (path.startsWith("/api/v1/admin") && role != Role.ADMIN) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        return true;
    }

}
