package com.smartuni.api.controller.ticket;

import com.smartuni.api.dto.request.AddCommentRequest;
import com.smartuni.api.dto.request.CreateTicketRequest;
import com.smartuni.api.dto.request.UpdateTicketRequest;
import com.smartuni.api.dto.responce.TicketResponse;
import com.smartuni.api.model.ticket.enums.TicketStatus;
import com.smartuni.api.service.ticket.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // POST /api/tickets - Create a new ticket
    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestBody CreateTicketRequest request,
            @RequestParam String reporterId,
            @RequestParam String reporterName) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.createTicket(request, reporterId, reporterName));
    }

    // GET /api/tickets - Get all tickets (Admin)
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // GET /api/tickets/{id} - Get ticket by ID
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    // GET /api/tickets/reporter/{reporterId} - Get tickets by reporter
    @GetMapping("/reporter/{reporterId}")
    public ResponseEntity<List<TicketResponse>> getTicketsByReporter(
            @PathVariable String reporterId) {
        return ResponseEntity.ok(ticketService.getTicketsByReporter(reporterId));
    }

    // GET /api/tickets/status/{status} - Get tickets by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TicketResponse>> getTicketsByStatus(
            @PathVariable TicketStatus status) {
        return ResponseEntity.ok(ticketService.getTicketsByStatus(status));
    }

    // PUT /api/tickets/{id} - Update ticket (Admin/Technician)
    @PutMapping("/{id}")
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable String id,
            @RequestBody UpdateTicketRequest request) {
        return ResponseEntity.ok(ticketService.updateTicket(id, request));
    }

    // DELETE /api/tickets/{id} - Delete ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    // POST /api/tickets/{id}/comments - Add comment
    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketResponse> addComment(
            @PathVariable String id,
            @Valid @RequestBody AddCommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.addComment(id, request));
    }

    // PUT /api/tickets/{ticketId}/comments/{commentId} - Edit comment
    @PutMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<TicketResponse> editComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @RequestParam String authorId,
            @Valid @RequestBody AddCommentRequest request) {
        return ResponseEntity.ok(ticketService.editComment(ticketId, commentId, authorId, request));
    }

    // DELETE /api/tickets/{ticketId}/comments/{commentId} - Delete comment
    @DeleteMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<TicketResponse> deleteComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @RequestParam String authorId) {
        return ResponseEntity.ok(ticketService.deleteComment(ticketId, commentId, authorId));
    }
}
