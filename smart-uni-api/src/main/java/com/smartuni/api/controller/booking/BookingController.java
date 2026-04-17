package com.smartuni.api.controller.booking;

import com.smartuni.api.dto.request.BookingRequest;
import com.smartuni.api.dto.request.BookingStatusRequest;
import com.smartuni.api.model.booking.Booking;
import com.smartuni.api.model.booking.BookingStatus;
import com.smartuni.api.service.booking.BookingService;
import com.smartuni.api.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final JwtUtil jwtUtil;

    // POST /api/bookings - Create a booking
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Booking> createBooking(
            @Valid @RequestBody BookingRequest request,
            HttpServletRequest httpRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        String token = extractToken(httpRequest);
        String userEmail = token != null ? jwtUtil.getEmail(token) : "";
        Booking booking = bookingService.createBooking(request, userId, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    // GET /api/bookings/my - Get current user's bookings
    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Booking>> getMyBookings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        List<Booking> bookings = bookingService.getMyBookings(userId);
        return ResponseEntity.ok(bookings);
    }

    // GET /api/bookings - Get all bookings (admin)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable String id,
            @Valid @RequestBody BookingStatusRequest request,
            HttpServletRequest httpRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String token = extractToken(httpRequest);
        String adminEmail = token != null ? jwtUtil.getEmail(token) : "";
        Booking booking = bookingService.updateBookingStatus(id, request, adminEmail);
        return ResponseEntity.ok(booking);
    }

    // DELETE /api/bookings/{id} - Delete a booking
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    // Helper method to extract JWT token from request header
    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}