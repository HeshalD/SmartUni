package com.smartuni.api.repository.notification;

import com.smartuni.api.model.notification.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    Page<Notification> findByRecipientIdOrderByCreatedAtDesc(String recipientId, Pageable pageable);

    List<Notification> findByRecipientIdAndReadFalse(String recipientId);

    long countByRecipientIdAndReadFalse(String recipientId);

    void deleteAllByRecipientId(String recipientId);
}