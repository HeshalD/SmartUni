package com.smartuni.api.model.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    private String id;

    @Indexed
    private String recipientId; // user ID

    private NotificationType type;

    private String title;

    private String message;

    private String referenceId;   // bookingId / ticketId / commentId
    private String referenceType; // "BOOKING" | "TICKET" | "COMMENT"

    @Builder.Default
    private boolean read = false;

    @CreatedDate
    private Instant createdAt;
}