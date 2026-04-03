package vn.bds360.backend.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private final Url url = new Url();

    @Getter
    @Setter
    public static class Url {
        private String backend;
        private String frontend;
    }

}