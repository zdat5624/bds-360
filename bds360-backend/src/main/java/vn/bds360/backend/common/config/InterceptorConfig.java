package vn.bds360.backend.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.RequiredArgsConstructor;
import vn.bds360.backend.security.PermissionInterceptor;

@Configuration
@RequiredArgsConstructor
public class InterceptorConfig implements WebMvcConfigurer {

    private final PermissionInterceptor permissionInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(permissionInterceptor)
                .addPathPatterns("/api/admin/**"); // Áp dụng Interceptor cho tất cả API admin
        // .excludePathPatterns("/api/auth/**", "/api/public/**", "/",
        // "/uploads/**",
        // "/api/auth/**",
        // "/api/address/**"); // Loại trừ các API công khai
    }
}
