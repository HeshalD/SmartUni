package com.smartuni.api.controller.auth;

import com.smartuni.api.dto.request.ForgotPasswordRequest;
import com.smartuni.api.dto.request.LoginRequest;
import com.smartuni.api.dto.request.SignupRequest;
import com.smartuni.api.dto.request.UpdateProfileRequest;
import com.smartuni.api.dto.request.VerifyOtpResetPasswordRequest;
import com.smartuni.api.dto.responce.AuthResponse;
import com.smartuni.api.dto.responce.UserProfileResponse;
import com.smartuni.api.model.auth.Role;
import com.smartuni.api.service.auth.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(authService.getProfile(auth.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(authService.updateProfile(auth.getName(), request));
    }

    @PostMapping("/admin/users/{userId}/roles/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfileResponse> assignRole(
            @PathVariable String userId,
            @PathVariable Role role) {
        return ResponseEntity.ok(authService.assignRole(userId, role));
    }

    @DeleteMapping("/admin/users/{userId}/roles/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfileResponse> removeRole(
            @PathVariable String userId,
            @PathVariable Role role) {
        return ResponseEntity.ok(authService.removeRole(userId, role));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(Map.of(
            "message", "If an account with that email exists, an OTP has been sent."
        ));
    }

    @PostMapping("/reset-password/verify-otp")
        public ResponseEntity<?> verifyOtpAndResetPassword(
            @Valid @RequestBody VerifyOtpResetPasswordRequest request) {
            authService.verifyOtpAndResetPassword(request);
        return ResponseEntity.ok(Map.of(
            "message", "Password reset successfully."
        ));
    }


}