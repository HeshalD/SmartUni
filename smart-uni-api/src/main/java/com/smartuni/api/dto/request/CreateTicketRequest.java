package com.smartuni.api.dto.request;

import com.smartuni.api.model.ticket.enums.TicketCategory;
import com.smartuni.api.model.ticket.enums.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CreateTicketRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private TicketCategory category;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    @NotBlank(message = "Location is required")
    private String location;

    private String resourceId;

    @NotBlank(message = "Contact details are required")
    private String contactDetails;

    @Size(max = 3, message = "Maximum 3 images allowed")
    private List<String> imageUrls;
}