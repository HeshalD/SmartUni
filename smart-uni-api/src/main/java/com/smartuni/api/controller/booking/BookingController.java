package com.smartuni.api.controller.booking;

import com.smartuni.api.dto.request.BookingRequest;
import com.smartuni.api.dto.request.BookingStatusRequest;
import com.smartuni.api.model.booking.Booking;
import com.smartuni.api.model.booking.BookingStatus;
import com.smartuni.api.service.booking.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // POST /api/bookings - Create a booking
    @PostMapping
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody BookingRequest request) {
        // Hardcoded user for now - will be replaced with real auth later
        String userId = "temp-user-id";
        String userEmail = "temp@email.com";
        Booking booking = bookingService.createBooking(request, userId, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    // GET /api/bookings/my - Get current user's bookings
    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings() {
        // Hardcoded user for now
        List<Booking> bookings = bookingService.getMyBookings("temp-user-id");
        return ResponseEntity.ok(bookings);
    }

    // GET /api/bookings - Get all bookings (admin)
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings(
        @RequestParam(required = false) BookingStatus status,
        @RequestParam(required = false) String resourceId) {
        List<Booking> bookings = bookingService.getAllBookings(status, resourceId);
        return ResponseEntity.ok(bookings);
    }

    // GET /api/bookings/{id} - Get single booking
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable String id) {
        Booking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    // PUT /api/bookings/{id}/status - Approve, reject or cancel
    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable String id,
            @Valid @RequestBody BookingStatusRequest request) {
        Booking booking = bookingService.updateBookingStatus(id, request, "admin@email.com");
        return ResponseEntity.ok(booking);
    }

    // DELETE /api/bookings/{id} - Delete a booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}