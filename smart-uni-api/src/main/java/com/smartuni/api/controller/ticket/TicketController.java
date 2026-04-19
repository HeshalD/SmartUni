package com.smartuni.api.controller.ticket;

import com.smartuni.api.dto.request.AddCommentRequest;
import com.smartuni.api.dto.request.CreateTicketRequest;
import com.smartuni.api.dto.request.UpdateTicketRequest;
import com.smartuni.api.dto.responce.TicketResponse;
import com.smartuni.api.model.ticket.enums.TicketStatus;
import com.smartuni.api.service.ticket.TicketService;
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
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final JwtUtil jwtUtil;

    // POST /api/tickets - Create a new ticket
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestBody CreateTicketRequest request,
            HttpServletRequest httpRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String reporterId = auth.getName();
        String token = extractToken(httpRequest);
        String reporterName = token != null ? jwtUtil.getEmail(token) : "";
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.createTicket(request, reporterId, reporterName));
    }

    // GET /api/tickets - Get all tickets (Admin)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // GET /api/tickets/{id} - Get ticket by ID
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    // GET /api/tickets/reporter/{reporterId} - Get tickets by reporter
    @GetMapping("/reporter/{reporterId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TicketResponse>> getTicketsByReporter(
            @PathVariable String reporterId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        // Allow users to only see their own tickets, or admins to see all
        if (!userId.equals(reporterId) && !auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(ticketService.getTicketsByReporter(reporterId));
    }

    // GET /api/tickets/status/{status} - Get tickets by status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TicketResponse>> getTicketsByStatus(
            @PathVariable TicketStatus status) {
        return ResponseEntity.ok(ticketService.getTicketsByStatus(status));
    }

    // PUT /api/tickets/{id} - Update ticket (Admin/Technician)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TECHNICIAN')")
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable String id,
            @RequestBody UpdateTicketRequest request) {
        return ResponseEntity.ok(ticketService.updateTicket(id, request));
    }

    // DELETE /api/tickets/{id} - Delete ticket
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    // POST /api/tickets/{id}/comments - Add comment
    @PostMapping("/{id}/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketResponse> addComment(
            @PathVariable String id,
            @Valid @RequestBody AddCommentRequest request,
            HttpServletRequest httpRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String authorId = auth.getName();
        String token = extractToken(httpRequest);
        String authorName = token != null ? jwtUtil.getEmail(token) : "";
        // Create a new request with extracted author info
        AddCommentRequest authenticatedRequest = new AddCommentRequest();
        authenticatedRequest.setContent(request.getContent());
        authenticatedRequest.setAuthorId(authorId);
        authenticatedRequest.setAuthorName(authorName);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.addComment(id, authenticatedRequest));
    }

    // PUT /api/tickets/{ticketId}/comments/{commentId} - Edit comment
    @PutMapping("/{ticketId}/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketResponse> editComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @Valid @RequestBody AddCommentRequest request,
            HttpServletRequest httpRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String authorId = auth.getName();
        String token = extractToken(httpRequest);
        String authorName = token != null ? jwtUtil.getEmail(token) : "";
        // Create a new request with extracted author info for validation
        AddCommentRequest authenticatedRequest = new AddCommentRequest();
        authenticatedRequest.setContent(request.getContent());
        authenticatedRequest.setAuthorId(authorId);
        authenticatedRequest.setAuthorName(authorName);
        return ResponseEntity.ok(ticketService.editComment(ticketId, commentId, authorId, authenticatedRequest));
    }

    // DELETE /api/tickets/{ticketId}/comments/{commentId} - Delete comment
    @DeleteMapping("/{ticketId}/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketResponse> deleteComment(
            @PathVariable String ticketId,
            @PathVariable String commentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String authorId = auth.getName();
        return ResponseEntity.ok(ticketService.deleteComment(ticketId, commentId, authorId));
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
