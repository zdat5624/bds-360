package vn.bds360.backend.security.resolver;

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
import vn.bds360.backend.security.SecurityUtil;
import vn.bds360.backend.security.annotation.CurrentUser;

@Component
@RequiredArgsConstructor
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

    private final UserRepository userRepository;

    // 1. Kiểm tra xem tham số có hợp lệ để xử lý không?
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        // Trả về TRUE nếu tham số có gắn @CurrentUser VÀ kiểu dữ liệu của nó là class
        // User
        return parameter.hasParameterAnnotation(CurrentUser.class)
                && parameter.getParameterType().equals(User.class);
    }

    // 2. Nếu hàm trên trả về TRUE, Spring sẽ chạy hàm này để lấy dữ liệu
    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {

        // Lấy Email từ Security Context (Token)
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        // Truy vấn Database và trả về Object User.
        // Object này sẽ được Spring tự động "bơm" vào tham số ở Controller
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }
}