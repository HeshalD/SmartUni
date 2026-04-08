package com.smartuni.api.service.auth;

import com.smartuni.api.dto.request.CreateTechnicianRequest;
import com.smartuni.api.dto.responce.UserProfileResponse;
import com.smartuni.api.dto.responce.UserSummaryResponse;
import com.smartuni.api.exception.BadRequestException;
import com.smartuni.api.exception.ResourceNotFoundException;
import com.smartuni.api.model.auth.AuthProvider;
import com.smartuni.api.model.auth.Role;
import com.smartuni.api.model.auth.User;
import com.smartuni.api.repository.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserSummaryResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    public List<UserSummaryResponse> getAllTechnicians() {
        return userRepository.findByRolesContaining(Role.TECHNICIAN)
                .stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    public UserProfileResponse createTechnician(CreateTechnicianRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User technician = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .provider(AuthProvider.LOCAL)
                .roles(Set.of(Role.TECHNICIAN))
                .enabled(true)
                .build();

        User savedTechnician = userRepository.save(technician);
        return toProfileResponse(savedTechnician);
    }

    public void deleteUser(String userId) {
        User user = findById(userId);

        if (user.getRoles().contains(Role.ADMIN)) {
            throw new BadRequestException("Admin account cannot be deleted from this endpoint");
        }

        userRepository.delete(user);
    }

    private User findById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserSummaryResponse toSummaryResponse(User user) {
        return UserSummaryResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .roles(user.getRoles())
                .provider(user.getProvider().name())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt())
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
}