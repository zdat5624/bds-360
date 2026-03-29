package vn.bds360.backend.security;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.modules.user.service.UserService;

@Component("userDetailsService")
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        vn.bds360.backend.modules.user.entity.User user = this.userService.handleGetUserByUserName(username);

        if (user == null) {
            throw new UsernameNotFoundException(ErrorCode.INVALID_CREDENTIALS.getMessage());
        }

        return new User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name())));
    }

}