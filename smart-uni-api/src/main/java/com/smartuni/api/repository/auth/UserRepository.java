package com.smartuni.api.repository.auth;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.smartuni.api.model.auth.User;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByProviderAndProviderId(String provider, String providerId);

    boolean existsByEmail(String email);
}
