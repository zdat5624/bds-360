package vn.bds360.backend.common.config;

import org.springdoc.core.utils.SpringDocUtils;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import jakarta.annotation.PostConstruct;
import vn.bds360.backend.security.annotation.CurrentUser;

@Configuration
@OpenAPIDefinition(info = @Info(title = "BDS 360 API Documentation", version = "1.0", description = "Tài liệu API cho hệ thống Bất Động Sản 360. Cung cấp các endpoint cho Frontend và Mobile App.", contact = @Contact(name = "Dev Team", email = "dev@bds360.vn")),
        // Áp dụng bảo mật JWT cho TẤT CẢ các API mặc định
        security = @SecurityRequirement(name = "bearerAuth"))
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT", description = "Nhập mã JWT Token của bạn vào đây (Không cần gõ chữ 'Bearer ')")
public class OpenApiConfig {

    @PostConstruct
    public void init() {
        // 1. Dạy Swagger bỏ qua tham số @CurrentUser để không bị lỗi 500 (Infinite
        // Recursion)
        SpringDocUtils.getConfig().addAnnotationsToIgnore(CurrentUser.class);
    }
}