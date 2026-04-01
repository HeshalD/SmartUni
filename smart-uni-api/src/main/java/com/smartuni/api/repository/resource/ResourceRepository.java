package com.smartuni.api.repository.resource;

import com.smartuni.api.model.resource.Resource;
import com.smartuni.api.model.resource.ResourceStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ResourceRepository extends MongoRepository<Resource, String> {

    List<Resource> findByCategoryIgnoreCase(String category);

    List<Resource> findByAvailable(Boolean available);

    List<Resource> findByCategoryIgnoreCaseAndAvailable(String category, Boolean available);

    List<Resource> findByStatus(ResourceStatus status);

    List<Resource> findByCapacityGreaterThanEqual(Integer minCapacity);

    List<Resource> findByLocationContainingIgnoreCase(String location);
}
