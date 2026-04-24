package com.smartuni.api.dto.responce;

import com.smartuni.api.model.ticket.Comment;
import com.smartuni.api.model.ticket.enums.TicketCategory;
import com.smartuni.api.model.ticket.enums.TicketPriority;
import com.smartuni.api.model.ticket.enums.TicketStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TicketResponse {

    private String id;
    private String title;
    private String description;
    private TicketCategory category;
    private TicketPriority priority;
    private TicketStatus status;
    private String resourceId;
    private String location;
    private String reporterId;
    private String reporterName;
    private String contactDetails;
    private String assignedTechnicianId;
    private String assignedTechnicianName;
    private String resolutionNotes;
    private String rejectionReason;
    private List<String> imageUrls;
    private List<Comment> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
}