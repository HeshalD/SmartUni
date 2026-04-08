package com.smartuni.api.controller.auth;

import com.smartuni.api.dto.request.CreateTechnicianRequest;
import com.smartuni.api.dto.responce.UserProfileResponse;
import com.smartuni.api.dto.responce.UserSummaryResponse;
import com.smartuni.api.service.auth.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/technicians")
    public ResponseEntity<List<UserSummaryResponse>> getAllTechnicians() {
        return ResponseEntity.ok(adminService.getAllTechnicians());
    }

    @PostMapping("/technicians")
    public ResponseEntity<UserProfileResponse> createTechnician(
            @Valid @RequestBody CreateTechnicianRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminService.createTechnician(request));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}