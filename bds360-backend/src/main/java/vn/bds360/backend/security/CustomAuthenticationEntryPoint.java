package vn.bds360.backend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.ObjectMapper;
import vn.bds360.backend.common.dto.response.RestResponse;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final AuthenticationEntryPoint delegate = new BearerTokenAuthenticationEntryPoint();

    private final ObjectMapper mapper;

    public CustomAuthenticationEntryPoint(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
        this.delegate.commence(request, response, authException);
        response.setContentType("application/json;charset=UTF-8");

        RestResponse<Object> res = new RestResponse<Object>();
        res.setStatusCode(HttpStatus.UNAUTHORIZED.value());

        // String errorMessage = Optional.ofNullable(authException.getCause()) // NULL
        // .map(Throwable::getMessage)
        // .orElse(authException.getMessage());
        // res.setError(errorMessage);

        String errorMessage;
        if (authException.getCause() != null) {
            errorMessage = authException.getCause().getMessage();
        } else {
            errorMessage = authException.getMessage();
        }
        res.setError(errorMessage);

        res.setMessage("Token không hợp lệ!");

        mapper.writeValue(response.getWriter(), res);
    }
}