package com.smartuni.api.model.resource;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityWindow {

    private String dayOfWeek;   // e.g. "MONDAY", "TUESDAY"
    private String startTime;   // e.g. "09:00"
    private String endTime;     // e.g. "17:00"
}
