package com.smartuni.api.service.resource;

import com.smartuni.api.dto.request.CreateResourceRequest;
import com.smartuni.api.dto.request.UpdateResourceRequest;
import com.smartuni.api.dto.responce.ResourceResponse;
import com.smartuni.api.exception.ResourceNotFoundException;
import com.smartuni.api.model.resource.Resource;
import com.smartuni.api.model.resource.ResourceStatus;
import com.smartuni.api.repository.resource.ResourceRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final MongoTemplate mongoTemplate;

    public ResourceService(ResourceRepository resourceRepository, MongoTemplate mongoTemplate) {
        this.resourceRepository = resourceRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public List<ResourceResponse> getResources(
            String category,
            Boolean available,
            ResourceStatus status,
            Integer minCapacity,
            String location
    ) {
        List<Criteria> criteriaList = new ArrayList<>();

        if (category != null && !category.isBlank()) {
            criteriaList.add(Criteria.where("category").regex(category, "i"));
        }
        if (available != null) {
            criteriaList.add(Criteria.where("available").is(available));
        }
        if (status != null) {
            criteriaList.add(Criteria.where("status").is(status));
        }
        if (minCapacity != null) {
            criteriaList.add(Criteria.where("capacity").gte(minCapacity));
        }
        if (location != null && !location.isBlank()) {
            criteriaList.add(Criteria.where("location").regex(location, "i"));
        }

        Query query = new Query();
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return mongoTemplate.find(query, Resource.class)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ResourceResponse getResourceById(String id) {
        return toResponse(findResourceById(id));
    }

    public ResourceResponse createResource(CreateResourceRequest request) {
        LocalDateTime now = LocalDateTime.now();

        Resource resource = Resource.builder()
            .name(request.getName())
            .category(request.getCategory())
            .location(request.getLocation())
            .description(request.getDescription())
            .capacity(request.getCapacity())
            .available(request.getAvailable())
            .status(request.getStatus() != null ? request.getStatus() : ResourceStatus.ACTIVE)
            .availabilityWindows(request.getAvailabilityWindows())
            .amenities(request.getAmenities())
            .imageUrl(request.getImageUrl())
            .contactPerson(request.getContactPerson())
            .createdAt(now)
            .updatedAt(now)
            .build();

        return toResponse(resourceRepository.save(resource));
    }

    public ResourceResponse updateResource(String id, UpdateResourceRequest request) {
        Resource resource = findResourceById(id);

        if (request.getName() != null) resource.setName(request.getName());
        if (request.getCategory() != null) resource.setCategory(request.getCategory());
        if (request.getLocation() != null) resource.setLocation(request.getLocation());
        if (request.getDescription() != null) resource.setDescription(request.getDescription());
        if (request.getCapacity() != null) resource.setCapacity(request.getCapacity());
        if (request.getAvailable() != null) resource.setAvailable(request.getAvailable());
        if (request.getStatus() != null) resource.setStatus(request.getStatus());
        if (request.getAvailabilityWindows() != null) resource.setAvailabilityWindows(request.getAvailabilityWindows());
        if (request.getAmenities() != null) resource.setAmenities(request.getAmenities());
        if (request.getImageUrl() != null) resource.setImageUrl(request.getImageUrl());
        if (request.getContactPerson() != null) resource.setContactPerson(request.getContactPerson());

        resource.setUpdatedAt(LocalDateTime.now());

        return toResponse(resourceRepository.save(resource));
    }

    public void deleteResource(String id) {
        resourceRepository.delete(findResourceById(id));
    }

    private Resource findResourceById(String id) {
        return resourceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    private ResourceResponse toResponse(Resource resource) {
        return ResourceResponse.builder()
            .id(resource.getId())
            .name(resource.getName())
            .category(resource.getCategory())
            .location(resource.getLocation())
            .description(resource.getDescription())
            .capacity(resource.getCapacity())
            .available(resource.getAvailable())
            .status(resource.getStatus())
            .availabilityWindows(resource.getAvailabilityWindows())
            .amenities(resource.getAmenities())
            .imageUrl(resource.getImageUrl())
            .contactPerson(resource.getContactPerson())
            .createdAt(resource.getCreatedAt())
            .updatedAt(resource.getUpdatedAt())
            .build();
    }
}

