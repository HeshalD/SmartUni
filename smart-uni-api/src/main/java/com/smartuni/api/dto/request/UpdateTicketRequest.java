package com.smartuni.api.dto.request;

import com.smartuni.api.model.ticket.enums.TicketStatus;
import lombok.Data;

@Data
public class UpdateTicketRequest {

    private TicketStatus status;
    private String assignedTechnicianId;
    private String assignedTechnicianName;
    private String resolutionNotes;
    private String rejectionReason;
}