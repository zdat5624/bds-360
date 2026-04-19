package vn.bds360.backend.security.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.springframework.security.access.prepost.PreAuthorize;

@Target({ ElementType.METHOD, ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
// 🌟 Cấp quyền cho ai có role ADMIN HOẶC MODERATOR
@PreAuthorize("hasAuthority('ADMIN') or hasRole('ADMIN') or hasAuthority('MODERATOR') or hasRole('MODERATOR')")
public @interface IsAdminOrModerator {
}