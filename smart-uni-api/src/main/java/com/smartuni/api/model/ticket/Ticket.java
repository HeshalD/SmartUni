package com.smartuni.api.model.ticket;

import com.smartuni.api.model.ticket.enums.TicketCategory;
import com.smartuni.api.model.ticket.enums.TicketPriority;
import com.smartuni.api.model.ticket.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    private String title;
    private String description;
    private TicketCategory category;
    private TicketPriority priority;
    private TicketStatus status;

    private String resourceId;
    private String location;

    // Reporter details
    private String reporterId;
    private String reporterName;
    private String contactDetails;

    // Technician assignment
    private String assignedTechnicianId;
    private String assignedTechnicianName;
    private String resolutionNotes;

    // Image attachments (max 3)
    private List<String> imageUrls = new ArrayList<>();

    // Comments
    private List<Comment> comments = new ArrayList<>();

    // Rejection reason
    private String rejectionReason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
}