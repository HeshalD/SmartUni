package com.smartuni.api.dto.request;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateResourceRequest {

    private String name;
    private String category;
    private String location;
    private String description;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private Boolean available;
    private List<String> amenities;
    private String imageUrl;
    private String contactPerson;
}
