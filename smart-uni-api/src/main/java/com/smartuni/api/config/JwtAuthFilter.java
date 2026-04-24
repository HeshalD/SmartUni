package com.smartuni.api.config;

import com.smartuni.api.service.auth.UserDetailsServiceImpl;
import com.smartuni.api.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain chain)
            throws ServletException, IOException {

        String token = extractToken(request);
        log.debug("Request: {} {} | Token present: {}", request.getMethod(), request.getRequestURI(), token != null);

        if (StringUtils.hasText(token)) {
            boolean valid = jwtUtil.isValid(token);
            log.debug("Token valid: {}", valid);

            if (valid) {
                String userId = jwtUtil.getUserId(token);
                log.debug("UserId from token: {}", userId);

                if (StringUtils.hasText(userId)) {
                    try {
                        UserDetails userDetails = userDetailsService.loadUserById(userId);
                        log.debug("Loaded user: {} with authorities: {}", userDetails.getUsername(), userDetails.getAuthorities());

                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        log.debug("Authentication set successfully");
                    } catch (Exception e) {
                        log.error("Failed to load user by id: {} | Error: {}", userId, e.getMessage());
                        SecurityContextHolder.clearContext();
                    }
                } else {
                    log.warn("UserId is null or empty in token");
                }
            } else {
                log.warn("Token is invalid");
            }
        }

        chain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}