package com.smartuni.api.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @Size(min = 2, max = 80, message = "Name must be 2–80 characters")
    private String name;

    // URL of an already-uploaded profile picture (optional)
    private String profilePictureUrl;
}