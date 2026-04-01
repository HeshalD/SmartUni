package com.smartuni.api.model.resource;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resources")
public class Resource {

    @Id
    private String id;

    private String name;
    private String category;
    private String location;
    private String description;
    private Integer capacity;
    private Boolean available;

    @Builder.Default
    private ResourceStatus status = ResourceStatus.ACTIVE;

    private List<AvailabilityWindow> availabilityWindows;
    private List<String> amenities;
    private String imageUrl;
    private String contactPerson;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
