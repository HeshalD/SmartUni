package com.smartuni.api.service.ticket;

import com.smartuni.api.dto.request.AddCommentRequest;
import com.smartuni.api.dto.request.CreateTicketRequest;
import com.smartuni.api.dto.request.UpdateTicketRequest;
import com.smartuni.api.dto.responce.TicketResponse;
import com.smartuni.api.model.ticket.Comment;
import com.smartuni.api.model.ticket.Ticket;
import com.smartuni.api.model.ticket.enums.TicketStatus;
import com.smartuni.api.repository.ticket.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;

    // Create a new ticket
    public TicketResponse createTicket(CreateTicketRequest request, String reporterId, String reporterName) {
        Ticket ticket = Ticket.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .priority(request.getPriority())
                .location(request.getLocation())
                .resourceId(request.getResourceId())
                .contactDetails(request.getContactDetails())
                .imageUrls(request.getImageUrls() != null ? request.getImageUrls() : List.of())
                .reporterId(reporterId)
                .reporterName(reporterName)
                .status(TicketStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return mapToResponse(ticketRepository.save(ticket));
    }

    // Get all tickets (Admin)
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get ticket by ID
    public TicketResponse getTicketById(String id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
        return mapToResponse(ticket);
    }

    // Get tickets by reporter
    public List<TicketResponse> getTicketsByReporter(String reporterId) {
        return ticketRepository.findByReporterId(reporterId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get tickets by status
    public List<TicketResponse> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Update ticket status (Admin/Technician)
    public TicketResponse updateTicket(String id, UpdateTicketRequest request) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));

        if (request.getStatus() != null) {
            ticket.setStatus(request.getStatus());
            if (request.getStatus() == TicketStatus.RESOLVED) {
                ticket.setResolvedAt(LocalDateTime.now());
            }
        }
        if (request.getAssignedTechnicianId() != null) {
            ticket.setAssignedTechnicianId(request.getAssignedTechnicianId());
        }
        if (request.getAssignedTechnicianName() != null) {
            ticket.setAssignedTechnicianName(request.getAssignedTechnicianName());
        }
        if (request.getResolutionNotes() != null) {
            ticket.setResolutionNotes(request.getResolutionNotes());
        }
        if (request.getRejectionReason() != null) {
            ticket.setRejectionReason(request.getRejectionReason());
        }

        ticket.setUpdatedAt(LocalDateTime.now());
        return mapToResponse(ticketRepository.save(ticket));
    }

    // Add comment to ticket
    public TicketResponse addComment(String ticketId, AddCommentRequest request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));

        Comment comment = Comment.builder()
                .id(UUID.randomUUID().toString())
                .content(request.getContent())
                .authorId(request.getAuthorId())
                .authorName(request.getAuthorName())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        ticket.getComments().add(comment);
        ticket.setUpdatedAt(LocalDateTime.now());
        return mapToResponse(ticketRepository.save(ticket));
    }

    // Edit comment
    public TicketResponse editComment(String ticketId, String commentId, String authorId, AddCommentRequest request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));

        Comment comment = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        if (!comment.getAuthorId().equals(authorId)) {
            throw new RuntimeException("You are not authorized to edit this comment");
        }

        comment.setContent(request.getContent());
        comment.setUpdatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        return mapToResponse(ticketRepository.save(ticket));
    }

    // Delete comment
    public TicketResponse deleteComment(String ticketId, String commentId, String authorId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));

        Comment comment = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        if (!comment.getAuthorId().equals(authorId)) {
            throw new RuntimeException("You are not authorized to delete this comment");
        }

        ticket.getComments().remove(comment);
        ticket.setUpdatedAt(LocalDateTime.now());
        return mapToResponse(ticketRepository.save(ticket));
    }

    // Delete ticket
    public void deleteTicket(String id) {
        if (!ticketRepository.existsById(id)) {
            throw new RuntimeException("Ticket not found with id: " + id);
        }
        ticketRepository.deleteById(id);
    }

    // Map Ticket to TicketResponse
    private TicketResponse mapToResponse(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .category(ticket.getCategory())
                .priority(ticket.getPriority())
                .status(ticket.getStatus())
                .resourceId(ticket.getResourceId())
                .location(ticket.getLocation())
                .reporterId(ticket.getReporterId())
                .reporterName(ticket.getReporterName())
                .contactDetails(ticket.getContactDetails())
                .assignedTechnicianId(ticket.getAssignedTechnicianId())
                .assignedTechnicianName(ticket.getAssignedTechnicianName())
                .resolutionNotes(ticket.getResolutionNotes())
                .rejectionReason(ticket.getRejectionReason())
                .imageUrls(ticket.getImageUrls())
                .comments(ticket.getComments())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .resolvedAt(ticket.getResolvedAt())
                .build();
    }
}
