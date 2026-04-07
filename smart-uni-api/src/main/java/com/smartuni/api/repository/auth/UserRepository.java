package com.smartuni.api.repository.auth;

import com.smartuni.api.model.auth.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByProviderIdAndProvider(String providerId,
            com.smartuni.api.model.auth.AuthProvider provider);
}