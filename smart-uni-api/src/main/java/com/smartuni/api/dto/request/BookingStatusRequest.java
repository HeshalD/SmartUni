package com.smartuni.api.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import com.smartuni.api.model.booking.BookingStatus;

@Data
public class BookingStatusRequest {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    private String adminNote; // optional reason for rejection
}