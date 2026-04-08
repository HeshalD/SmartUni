package com.smartuni.api.service.auth;

import com.smartuni.api.model.auth.AuthProvider;
import com.smartuni.api.model.auth.Role;
import com.smartuni.api.model.auth.User;
import com.smartuni.api.repository.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class OAuth2UserServiceImpl extends OidcUserService {

    private final UserRepository userRepository;

    @Override
    public OidcUser loadUser(OidcUserRequest request) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(request);

        String providerId = oidcUser.getSubject(); // "sub" claim - always present in OIDC
        String email      = oidcUser.getEmail();
        String name       = oidcUser.getFullName();
        String picture    = oidcUser.getPicture();

        User user = userRepository.findByProviderIdAndProvider(providerId, AuthProvider.GOOGLE)
                .orElseGet(() -> userRepository.findByEmail(email)
                        .map(existing -> {
                            existing.setProvider(AuthProvider.GOOGLE);
                            existing.setProviderId(providerId);
                            if (existing.getProfilePictureUrl() == null) {
                                existing.setProfilePictureUrl(picture);
                            }
                            return existing;
                        })
                        .orElseGet(() -> User.builder()
                                .email(email)
                                .name(name)
                                .profilePictureUrl(picture)
                                .provider(AuthProvider.GOOGLE)
                                .providerId(providerId)
                                .roles(Set.of(Role.USER))
                                .build())
                );

        User savedUser = userRepository.save(user);

        // Store the internal userId so the success handler can build the JWT
        return new DefaultOidcUser(
                Set.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER")),
                oidcUser.getIdToken(),
                oidcUser.getUserInfo(),
                "email"
        ) {
            @Override
            public String getName() {
                return savedUser.getId();
            }

            @Override
            public <A> A getAttribute(String name) {
                if ("userId".equals(name)) {
                    //noinspection unchecked
                    return (A) savedUser.getId();
                }
                return super.getAttribute(name);
            }
        };
    }
}