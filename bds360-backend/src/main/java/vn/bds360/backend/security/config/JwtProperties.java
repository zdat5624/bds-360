package vn.bds360.backend.security.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "api.jwt")
public class JwtProperties {
    private String base64Secret;
    private long tokenValidityInSeconds;
}