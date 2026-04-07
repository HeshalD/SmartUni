package com.smartuni.api.controller.notification;

// Temporary dev-only controller for manual notification testing

import com.smartuni.api.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dev/notifications")
@RequiredArgsConstructor
public class NotificationDevController {

    private final NotificationService notificationService;

    @PostMapping("/booking-approved")
    public ResponseEntity<Void> bookingApproved(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String bookingId) {
        notificationService.notifyBookingApproved(userDetails.getUsername(), bookingId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/booking-rejected")
    public ResponseEntity<Void> bookingRejected(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String bookingId,
            @RequestParam String reason) {
        notificationService.notifyBookingRejected(userDetails.getUsername(), bookingId, reason);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/ticket-status")
    public ResponseEntity<Void> ticketStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String ticketId,
            @RequestParam String status) {
        notificationService.notifyTicketStatusChanged(userDetails.getUsername(), ticketId, status);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/ticket-comment")
    public ResponseEntity<Void> ticketComment(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String ticketId,
            @RequestParam String commenterName) {
        notificationService.notifyNewTicketComment(userDetails.getUsername(), ticketId, commenterName);
        return ResponseEntity.ok().build();
    }
}