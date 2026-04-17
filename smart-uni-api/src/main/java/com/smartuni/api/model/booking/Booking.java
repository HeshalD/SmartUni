package com.smartuni.api.model.booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data                   // Lombok: generates getters, setters, toString
@Builder                // Lombok: lets you use Booking.builder().field(value).build()
@NoArgsConstructor      // Lombok: generates empty constructor
@AllArgsConstructor     // Lombok: generates constructor with all fields
@Document(collection = "bookings")  // tells MongoDB which collection to use
public class Booking {

    @Id
    private String id;

    // Who made the booking (will link to User once auth is done)
    private String userId;
    private String userEmail;

    // What resource is being booked (links to Module A)
    private String resourceId;
    private String resourceName;

    // Booking time details
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    // Booking details
    private String purpose;
    private int expectedAttendees;

    // Workflow status
    private BookingStatus status;

    // Admin response
    private String adminNote;
    private String reviewedBy;
    private LocalDateTime reviewedAt;

    // Audit fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}