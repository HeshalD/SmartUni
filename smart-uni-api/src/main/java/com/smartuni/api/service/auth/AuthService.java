package com.smartuni.api.service.auth;

import org.springframework.stereotype.Service;

import com.smartuni.api.dto.responce.AuthUserResponse;
import com.smartuni.api.model.auth.User;
import com.smartuni.api.repository.auth.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public AuthUserResponse getOrCreateOAuthUser(
            String name,
            String email,
            String provider,
            String providerId,
            String profilePictureUrl) {

        User user = userRepository.findByEmail(email)
                .map(existingUser -> {
                    existingUser.setName(name);
                    existingUser.setProvider(provider);
                    existingUser.setProviderId(providerId);
                    existingUser.setProfilePictureUrl(profilePictureUrl);
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .name(name)
                                .email(email)
                                .provider(provider)
                                .providerId(providerId)
                                .profilePictureUrl(profilePictureUrl)
                                .build()
                ));

        return mapToResponse(user);
    }

    public AuthUserResponse mapToResponse(User user) {
        return AuthUserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .provider(user.getProvider())
                .profilePictureUrl(user.getProfilePictureUrl())
                .active(user.getActive())
                .build();
    }
}
