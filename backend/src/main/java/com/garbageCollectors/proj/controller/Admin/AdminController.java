package com.garbageCollectors.proj.controller.Admin;

import com.garbageCollectors.proj.model.Admin.Admin;
import com.garbageCollectors.proj.model.Admin.AdminRepo;
import com.garbageCollectors.proj.model.Guard.Guard;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {

    @Autowired
    private Admin adminService;

//    private ResponseEntity<String> buildErrorResponse(HttpStatus status, String message) {
//        // You can return a JSON object here if you define an ErrorDetails DTO,
//        // but for simplicity, we return a string message.
//        return ResponseEntity.status(status).body(message);
//    }

    @PutMapping("/login")
    public ResponseEntity<AdminResponseDTO> adminLogin(@RequestBody AdminRequestDTO request) {
        try {
            AdminResponseDTO response = adminService.authenticateAdmin(request);
            return ResponseEntity.ok(response);
        }
        catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/addGuard")
    public ResponseEntity<Guard> addGuard(@RequestBody AdminRequestDTO request) {
        try {
            Guard newGuard = adminService.addGuard(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(newGuard);
        }
        catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delGuard/{guardId}")
    public ResponseEntity<Void> deleteGuard(@PathVariable String guardId) {
        try {
            adminService.deleteGuard(guardId);
            return ResponseEntity.noContent().build();
        }
        catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }


}

