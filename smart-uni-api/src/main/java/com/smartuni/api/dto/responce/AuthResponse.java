package com.smartuni.api.dto.responce;

import com.smartuni.api.model.auth.Role;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String id;
    private String email;
    private String name;
    private String profilePictureUrl;
    private Set<Role> roles;
}