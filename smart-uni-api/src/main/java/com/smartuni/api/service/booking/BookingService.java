package com.smartuni.api.service.booking;

import com.smartuni.api.dto.request.BookingRequest;
import com.smartuni.api.dto.request.BookingStatusRequest;
import com.smartuni.api.model.booking.Booking;
import com.smartuni.api.model.booking.BookingStatus;
import com.smartuni.api.repository.booking.BookingRepository;
import com.smartuni.api.exception.BadRequestException;
import com.smartuni.api.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor // Lombok: generates constructor for all final fields (replaces @Autowired)
public class BookingService {

    private final BookingRepository bookingRepository;

    // Create a new booking
    public Booking createBooking(BookingRequest request, String userId, String userEmail) {

        // Validate time range
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new BadRequestException("End time must be after start time");
        }

        // Check for conflicts
        List<Booking> conflicts = bookingRepository
                .findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
                        request.getResourceId(),
                        BookingStatus.APPROVED,
                        request.getEndTime(),
                        request.getStartTime());

        if (!conflicts.isEmpty()) {
            throw new BadRequestException("Resource is already booked for this time slot");
        }

        // Build and save the booking
        Booking booking = Booking.builder()
                .userId(userId)
                .userEmail(userEmail)
                .resourceId(request.getResourceId())
                .resourceName(request.getResourceName())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .expectedAttendees(request.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return bookingRepository.save(booking);
    }

    // Get bookings for a specific user
    public List<Booking> getMyBookings(String userId) {
        return getMyBookings(userId, null);
    }

    public List<Booking> getMyBookings(String userId, BookingStatus status) {
        if (status != null) {
            return bookingRepository.findByUserIdAndStatus(userId, status);
        }
        return bookingRepository.findByUserId(userId);
    }

    // Get all bookings (admin only)
    public List<Booking> getAllBookings(BookingStatus status, String resourceId) {
        if (status != null && resourceId != null) {
            return bookingRepository.findByStatusAndResourceId(status, resourceId);
        } else if (status != null) {
            return bookingRepository.findByStatus(status);
        } else if (resourceId != null) {
            return bookingRepository.findByResourceId(resourceId);
        }
        return bookingRepository.findAll();
    }

    // Get a single booking by ID
    public Booking getBookingById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    // Update booking status (approve, reject, cancel)
    public Booking updateBookingStatus(String id, BookingStatusRequest request, String adminEmail) {

        Booking booking = getBookingById(id);

        // Validate status transitions
        validateStatusTransition(booking.getStatus(), request.getStatus());

        booking.setStatus(request.getStatus());
        booking.setAdminNote(request.getAdminNote());
        booking.setReviewedBy(adminEmail);
        booking.setReviewedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    // Delete a booking
    public void deleteBooking(String id) {
        Booking booking = getBookingById(id);
        bookingRepository.delete(booking);
    }

    // Helper: validate that the status change is allowed
    private void validateStatusTransition(BookingStatus current, BookingStatus next) {
        boolean valid = switch (current) {
            case PENDING -> next == BookingStatus.APPROVED || next == BookingStatus.REJECTED;
            case APPROVED -> next == BookingStatus.CANCELLED;
            default -> false;
        };

        if (!valid) {
            throw new BadRequestException(
                    "Invalid status transition from " + current + " to " + next);
        }
    }
}
