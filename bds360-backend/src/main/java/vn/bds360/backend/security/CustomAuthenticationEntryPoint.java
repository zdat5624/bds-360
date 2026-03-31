package vn.bds360.backend.security;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.ObjectMapper;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.common.exception.ErrorCode;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper mapper;

    public CustomAuthenticationEntryPoint(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public void commence(HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");

        ApiResponse<Void> apiResponse = ApiResponse.error(
                ErrorCode.UNAUTHORIZED.getCode(),
                ErrorCode.UNAUTHORIZED.getMessage());

        mapper.writeValue(response.getWriter(), apiResponse);
    }
}