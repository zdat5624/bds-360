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

                // 1. Lấy Email từ Security Context (Token) một cách an toàn
                Optional<String> emailOpt = SecurityService.getCurrentUserLogin();

                // 🌟 NẾU KHÔNG ĐĂNG NHẬP (Khách vãng lai): Trả về null thay vì ném lỗi
                if (emailOpt.isEmpty()) {
                        return null;
                }

                // 2. NẾU CÓ TOKEN NHƯNG KHÔNG CÓ TRONG DB: Lúc này mới ném lỗi (Token ảo/User
                // đã bị xóa)
                return userRepository.findByEmail(emailOpt.get())
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        }
}