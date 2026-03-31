package vn.bds360.backend.common.config;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.RequiredArgsConstructor;
import vn.bds360.backend.security.resolver.CurrentUserArgumentResolver;

@Configuration
@RequiredArgsConstructor
public class WebArgumentResolverConfig implements WebMvcConfigurer {

    private final CurrentUserArgumentResolver currentUserArgumentResolver;

    // Đăng ký custom resolver của chúng ta vào hệ thống Spring Web
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(currentUserArgumentResolver);
    }
}