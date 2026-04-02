package com.smartuni.api.repository.ticket;

import com.smartuni.api.model.ticket.Ticket;
import com.smartuni.api.model.ticket.enums.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {

    // Get all tickets by a specific user
    List<Ticket> findByReporterId(String reporterId);

    // Get all tickets by status
    List<Ticket> findByStatus(TicketStatus status);

    // Get all tickets assigned to a technician
    List<Ticket> findByAssignedTechnicianId(String technicianId);

    // Get all tickets by category
    List<Ticket> findByCategory(String category);

    // Get tickets by reporter and status
    List<Ticket> findByReporterIdAndStatus(String reporterId, TicketStatus status);
}