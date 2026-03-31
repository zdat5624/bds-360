package vn.bds360.backend.modules.transaction.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "vnp")
public class VnPayProperties {
    private String payUrl;
    private String returnUrlBackend;
    private String returnUrlFrontend;
    private String tmnCode;
    private String secretKey;
    private String apiUrl;
    private String version = "2.1.0";
    private String command = "pay";
}