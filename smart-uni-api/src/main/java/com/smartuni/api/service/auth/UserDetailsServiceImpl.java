package com.smartuni.api.service.auth;

import com.smartuni.api.model.auth.User;
import com.smartuni.api.repository.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    /** Called by Spring Security during email/password login */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return buildUserDetails(user);
    }

    /** Called by JWT filter using stored userId */
    public UserDetails loadUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found by id: " + userId));
        return buildUserDetails(user);
    }

    private UserDetails buildUserDetails(User user) {
        var authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .collect(Collectors.toSet());

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getId())
                .password(user.getPasswordHash() != null ? user.getPasswordHash() : "")
                .authorities(authorities)
                .accountLocked(!user.isEnabled())
                .build();
    }
}