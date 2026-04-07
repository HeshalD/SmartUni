package com.smartuni.api.repository.booking;

import com.smartuni.api.model.booking.Booking;
import com.smartuni.api.model.booking.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    // Get all bookings for a specific user
    List<Booking> findByUserId(String userId);

    // Get all bookings for a specific user filtered by status
    List<Booking> findByUserIdAndStatus(String userId, BookingStatus status);

    // Get all bookings for a specific resource (for conflict checking)
    List<Booking> findByResourceIdAndStatusNot(String resourceId, BookingStatus status);

    // Find overlapping bookings for conflict detection
    List<Booking> findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
        String resourceId,
        BookingStatus status,
        LocalDateTime endTime,
        LocalDateTime startTime
    );
}
    

