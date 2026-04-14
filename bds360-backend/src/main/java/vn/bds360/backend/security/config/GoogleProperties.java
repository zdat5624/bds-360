package vn.bds360.backend.security.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "google.client")
public class GoogleProperties {

    /**
     * Tương ứng với biến google.client.id trong application.properties
     */
    private String id;
    private String secret;

}