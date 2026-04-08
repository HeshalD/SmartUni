package com.smartuni.api.dto.responce;

import com.smartuni.api.model.auth.Role;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.Set;

@Data
@Builder
public class UserSummaryResponse {
    private String id;
    private String name;
    private String email;
    private Set<Role> roles;
    private String provider;
    private boolean enabled;
    private Instant createdAt;
}