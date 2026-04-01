package com.smartuni.api.service.resource;

import com.smartuni.api.dto.request.CreateResourceRequest;
import com.smartuni.api.dto.request.UpdateResourceRequest;
import com.smartuni.api.dto.responce.ResourceResponse;
import com.smartuni.api.exception.ResourceNotFoundException;
import com.smartuni.api.model.resource.Resource;
import com.smartuni.api.repository.resource.ResourceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public List<ResourceResponse> getResources(String category, Boolean available) {
        List<Resource> resources;

        if (category != null && !category.isBlank() && available != null) {
            resources = resourceRepository.findByCategoryIgnoreCaseAndAvailable(category, available);
        } else if (category != null && !category.isBlank()) {
            resources = resourceRepository.findByCategoryIgnoreCase(category);
        } else if (available != null) {
            resources = resourceRepository.findByAvailable(available);
        } else {
            resources = resourceRepository.findAll();
        }

        return resources.stream().map(this::toResponse).toList();
    }

    public ResourceResponse getResourceById(String id) {
        Resource resource = findResourceById(id);
        return toResponse(resource);
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
            .amenities(request.getAmenities())
            .imageUrl(request.getImageUrl())
            .contactPerson(request.getContactPerson())
            .createdAt(now)
            .updatedAt(now)
            .build();

        Resource savedResource = resourceRepository.save(resource);
        return toResponse(savedResource);
    }

    public ResourceResponse updateResource(String id, UpdateResourceRequest request) {
        Resource resource = findResourceById(id);

        if (request.getName() != null) {
            resource.setName(request.getName());
        }
        if (request.getCategory() != null) {
            resource.setCategory(request.getCategory());
        }
        if (request.getLocation() != null) {
            resource.setLocation(request.getLocation());
        }
        if (request.getDescription() != null) {
            resource.setDescription(request.getDescription());
        }
        if (request.getCapacity() != null) {
            resource.setCapacity(request.getCapacity());
        }
        if (request.getAvailable() != null) {
            resource.setAvailable(request.getAvailable());
        }
        if (request.getAmenities() != null) {
            resource.setAmenities(request.getAmenities());
        }
        if (request.getImageUrl() != null) {
            resource.setImageUrl(request.getImageUrl());
        }
        if (request.getContactPerson() != null) {
            resource.setContactPerson(request.getContactPerson());
        }

        resource.setUpdatedAt(LocalDateTime.now());

        Resource updatedResource = resourceRepository.save(resource);
        return toResponse(updatedResource);
    }

    public void deleteResource(String id) {
        Resource resource = findResourceById(id);
        resourceRepository.delete(resource);
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
            .amenities(resource.getAmenities())
            .imageUrl(resource.getImageUrl())
            .contactPerson(resource.getContactPerson())
            .createdAt(resource.getCreatedAt())
            .updatedAt(resource.getUpdatedAt())
            .build();
    }
}
