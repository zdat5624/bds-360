// File: vn.bds360.backend.security.resolver.CurrentUserArgumentResolver.java
package vn.bds360.backend.security.resolver;

import java.util.Optional;

import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.repository.UserRepository;
import vn.bds360.backend.security.SecurityService;
import vn.bds360.backend.security.annotation.CurrentUser;
import vn.bds360.backend.security.annotation.RequireLogin; // 🌟 Bổ sung import

@Component
@RequiredArgsConstructor
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

        private final UserRepository userRepository;

        @Override
        public boolean supportsParameter(MethodParameter parameter) {
                return parameter.hasParameterAnnotation(CurrentUser.class)
                                && parameter.getParameterType().equals(User.class);
        }

        @Override
        public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                        NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {

                Optional<String> emailOpt = SecurityService.getCurrentUserLogin();
                User user = null;

                // 1. Bỏ qua nếu không có token HOẶC bị Spring tự gán là "anonymousUser"
                if (emailOpt.isPresent() && !"anonymousUser".equals(emailOpt.get())) {
                        user = userRepository.findByEmail(emailOpt.get()).orElse(null);
                }

                // 2. Kiểm tra xem API hiện tại có bắt buộc đăng nhập không (@RequireLogin)
                boolean isRequireLogin = parameter.getMethodAnnotation(RequireLogin.class) != null
                                || parameter.getDeclaringClass().getAnnotation(RequireLogin.class) != null;

                // 3. Xử lý logic trả về thông minh
                if (user == null && isRequireLogin) {
                        // Nếu API là Private mà thông tin user = null -> Chặn đứng, ném lỗi 401
                        throw new AppException(ErrorCode.UNAUTHORIZED);
                }

                // Nếu API là Public (như /for-you) -> Thoải mái trả về null để luồng code chạy
                // tiếp vào Service
                return user;
        }
}