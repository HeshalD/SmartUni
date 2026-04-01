package com.smartuni.api.dto.request;

import com.smartuni.api.model.resource.AvailabilityWindow;
import com.smartuni.api.model.resource.ResourceStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateResourceRequest {

    @NotBlank(message = "Resource name is required")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Location is required")
    private String location;

    private String description;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotNull(message = "Availability is required")
    private Boolean available;

    private ResourceStatus status;
    private List<AvailabilityWindow> availabilityWindows;
    private List<String> amenities;
    private String imageUrl;
    private String contactPerson;
}
