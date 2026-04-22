package com.smartuni.api.service.notification;

import com.smartuni.api.dto.responce.NotificationResponse;
import com.smartuni.api.exception.ForbiddenException;
import com.smartuni.api.exception.ResourceNotFoundException;
import com.smartuni.api.model.notification.Notification;
import com.smartuni.api.model.notification.NotificationType;
import com.smartuni.api.repository.notification.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // ── Public trigger API (called by Booking / Ticket / Comment services) ──

    public void notifyBookingApproved(String recipientId, String bookingId) {
        create(recipientId, NotificationType.BOOKING_APPROVED,
                "Booking approved",
                "Your booking request has been approved.",
                bookingId, "BOOKING");
    }

    public void notifyBookingRejected(String recipientId, String bookingId, String reason) {
        create(recipientId, NotificationType.BOOKING_REJECTED,
                "Booking rejected",
                "Your booking request was rejected. Reason: " + reason,
                bookingId, "BOOKING");
    }

    public void notifyBookingCancelled(String recipientId, String bookingId) {
        create(recipientId, NotificationType.BOOKING_CANCELLED,
                "Booking cancelled",
                "A booking has been cancelled.",
                bookingId, "BOOKING");
    }

    public void notifyTicketStatusChanged(String recipientId, String ticketId, String newStatus) {
        create(recipientId, NotificationType.TICKET_STATUS_CHANGED,
                "Ticket status updated",
                "Your ticket status changed to: " + newStatus,
                ticketId, "TICKET");
    }

    public void notifyNewTicketComment(String recipientId, String ticketId, String commenterName) {
        create(recipientId, NotificationType.TICKET_COMMENT_ADDED,
                "New comment on your ticket",
                commenterName + " added a comment on your ticket.",
                ticketId, "TICKET");
    }

    // ── REST-facing methods ──────────────────────────────────────────────────

    public Page<NotificationResponse> getNotifications(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository
                .findByRecipientIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toResponse);
    }

    public Page<NotificationResponse> getAllNotifications(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository
                .findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toResponse);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByRecipientIdAndReadFalse(userId);
    }

    @Transactional
    public NotificationResponse markAsRead(String notificationId, String userId) {
        Notification notification = findAndVerifyOwner(notificationId, userId);
        notification.setRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByRecipientIdAndReadFalse(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void deleteNotification(String notificationId, String userId) {
        findAndVerifyOwner(notificationId, userId);
        notificationRepository.deleteById(notificationId);
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    private void create(String recipientId, NotificationType type,
                        String title, String message,
                        String referenceId, String referenceType) {
        Notification notification = Notification.builder()
                .recipientId(recipientId)
                .type(type)
                .title(title)
                .message(message)
                .referenceId(referenceId)
                .referenceType(referenceType)
                .build();
        notificationRepository.save(notification);
    }

    private Notification findAndVerifyOwner(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!notification.getRecipientId().equals(userId)) {
            throw new ForbiddenException("Not your notification");
        }
        return notification;
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .type(n.getType())
                .title(n.getTitle())
                .message(n.getMessage())
                .referenceId(n.getReferenceId())
                .referenceType(n.getReferenceType())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}