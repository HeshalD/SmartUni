package com.smartuni.api.dto.responce;

import com.smartuni.api.model.resource.AvailabilityWindow;
import com.smartuni.api.model.resource.ResourceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceResponse {

    private String id;
    private String name;
    private String category;
    private String location;
    private String description;
    private Integer capacity;
    private Boolean available;
    private ResourceStatus status;
    private List<AvailabilityWindow> availabilityWindows;
    private List<String> amenities;
    private String imageUrl;
    private String contactPerson;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
