package com.smartuni.api.dto.responce;

import com.smartuni.api.model.auth.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthUserResponse {

    private String id;
    private String name;
    private String email;
    private Role role;
    private String provider;
    private String profilePictureUrl;
    private Boolean active;
}
