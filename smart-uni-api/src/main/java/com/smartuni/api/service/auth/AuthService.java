package com.smartuni.api.service.auth;

import com.smartuni.api.dto.request.ForgotPasswordRequest;
import com.smartuni.api.dto.request.LoginRequest;
import com.smartuni.api.dto.request.SignupRequest;
import com.smartuni.api.dto.request.UpdateProfileRequest;
import com.smartuni.api.dto.request.VerifyOtpResetPasswordRequest;
import com.smartuni.api.dto.responce.AuthResponse;
import com.smartuni.api.dto.responce.UserProfileResponse;
import com.smartuni.api.exception.BadRequestException;
import com.smartuni.api.exception.ResourceNotFoundException;
import com.smartuni.api.model.auth.AuthProvider;
import com.smartuni.api.model.auth.Role;
import com.smartuni.api.model.auth.User;
import com.smartuni.api.repository.auth.UserRepository;
import com.smartuni.api.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;


import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthResponse signup(SignupRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new BadRequestException("Email already registered");
    }

    User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .provider(AuthProvider.LOCAL)
            .roles(Set.of(Role.USER))
            .build();

    User savedUser = userRepository.save(user);
    String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getEmail());
        return buildAuthResponse(savedUser, token);
    }

    public AuthResponse login(LoginRequest request) {
        // Delegates to Spring Security (throws on bad credentials)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        return buildAuthResponse(user, token);
    }

    public UserProfileResponse getProfile(String userId) {
        User user = findById(userId);
        return toProfileResponse(user);
    }

    public UserProfileResponse updateProfile(String userId, UpdateProfileRequest request) {
        User user = findById(userId);

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getProfilePictureUrl() != null) {
            user.setProfilePictureUrl(request.getProfilePictureUrl());
        }

        userRepository.save(user);
        return toProfileResponse(user);
    }

    public void forgotPassword(ForgotPasswordRequest request) {
    User user = userRepository.findByEmail(request.getEmail()).orElse(null);

    // Always return silently to avoid revealing whether the email exists
    if (user == null) {
        return;
    }

    String otp = generateOtp();

    user.setPasswordResetOtp(otp);
    user.setPasswordResetOtpExpiry(Instant.now().plus(10, ChronoUnit.MINUTES));

    userRepository.save(user);

    emailService.sendPasswordResetOtp(user.getEmail(), otp);
}

    public void verifyOtpAndResetPassword(VerifyOtpResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or OTP"));

        if (user.getPasswordResetOtp() == null || user.getPasswordResetOtpExpiry() == null) {
            throw new BadRequestException("No password reset OTP found");
        }

        if (Instant.now().isAfter(user.getPasswordResetOtpExpiry())) {
            throw new BadRequestException("OTP has expired");
        }

        if (!user.getPasswordResetOtp().equals(request.getOtp())) {
            throw new BadRequestException("Invalid OTP");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetOtp(null);
        user.setPasswordResetOtpExpiry(null);

        userRepository.save(user);
}

    // ── Admin helpers ────────────────────────────────────────────────────────

    public UserProfileResponse assignRole(String userId, Role role) {
        User user = findById(userId);

        Set<Role> updatedRoles = new java.util.HashSet<>(user.getRoles());
        updatedRoles.add(role);
        user.setRoles(updatedRoles);

        userRepository.save(user);
        return toProfileResponse(user);
    }

    public UserProfileResponse removeRole(String userId, Role role) {
        User user = findById(userId);

        Set<Role> updatedRoles = new java.util.HashSet<>(user.getRoles());

        if (updatedRoles.size() <= 1) {
            throw new BadRequestException("User must retain at least one role");
        }

        updatedRoles.remove(role);

        if (updatedRoles.isEmpty()) {
            throw new BadRequestException("User must retain at least one role");
        }

        user.setRoles(updatedRoles);
        userRepository.save(user);
        return toProfileResponse(user);
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    private User findById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .roles(user.getRoles())
                .build();
    }

    private UserProfileResponse toProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .roles(user.getRoles())
                .provider(user.getProvider().name())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        return String.format("%06d", random.nextInt(1000000));
    }
}