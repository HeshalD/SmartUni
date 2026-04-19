package com.smartuni.api.controller.resource;

import com.smartuni.api.dto.request.CreateResourceRequest;
import com.smartuni.api.dto.request.UpdateResourceRequest;
import com.smartuni.api.dto.responce.ResourceResponse;
import com.smartuni.api.model.resource.ResourceStatus;
import com.smartuni.api.service.resource.ResourceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public ResponseEntity<List<ResourceResponse>> getResources(
        @RequestParam(required = false) String category,
        @RequestParam(required = false) Boolean available,
        @RequestParam(required = false) ResourceStatus status,
        @RequestParam(required = false) Integer minCapacity,
        @RequestParam(required = false) String location
    ) {
        return ResponseEntity.ok(resourceService.getResources(category, available, status, minCapacity, location));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponse> getResourceById(@PathVariable String id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponse> createResource(@Valid @RequestBody CreateResourceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.createResource(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponse> updateResource(
        @PathVariable String id,
        @Valid @RequestBody UpdateResourceRequest request
    ) {
        return ResponseEntity.ok(resourceService.updateResource(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
