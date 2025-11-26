package com.garbageCollectors.proj.controller.Admin;

import com.garbageCollectors.proj.controller.Guard.GuardRequestDTO;
import com.garbageCollectors.proj.controller.Guard.GuardResponseDTO;
import com.garbageCollectors.proj.model.Admin.Admin;
import com.garbageCollectors.proj.model.Admin.AdminRepo;
import com.garbageCollectors.proj.model.Guard.Guard;
import com.garbageCollectors.proj.service.JWTService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {

    @Autowired
    private Admin adminService;

    private final JWTService jwtService;

//    private ResponseEntity<String> buildErrorResponse(HttpStatus status, String message) {
//        // You can return a JSON object here if you define an ErrorDetails DTO,
//        // but for simplicity, we return a string message.
//        return ResponseEntity.status(status).body(message);
//    }


    private ResponseEntity<?> verifyTokenAndGetErrorResponse(@RequestHeader("Authorization") String authHeader, String requiredRole) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        String token = authHeader.substring(7);

        try {
            Jws<Claims> data = jwtService.verifyToken(token);
            Claims claims = data.getBody();

            String role = claims.get("role", String.class);
            if (role == null || !role.equals(requiredRole)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: Insufficient permissions.");
            }

            // Verification passed: return null to signal main logic to proceed
            return null;

        } catch (Exception e) {
            // Catches expired token, signature mismatch, etc.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired authorization token.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestHeader("Authorization") String authHeader, @RequestBody AdminRequestDTO request) {

        try {
            AdminResponseDTO response = adminService.authenticateAdmin(request);
            return ResponseEntity.ok(response);
        }
        catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/addGuard")
    public ResponseEntity<?> addGuard(@RequestHeader("Authorization") String authHeader, @RequestBody GuardRequestDTO request) {
        ResponseEntity<?> errorResponse = verifyTokenAndGetErrorResponse(authHeader, "ADMIN");
        if (errorResponse != null) {
            return errorResponse; // Stops execution and returns 401/403 error
        }
        try {
            Guard newGuard = adminService.addGuard(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(newGuard);
        }
        catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delGuard/{guardId}")
    public ResponseEntity<?> deleteGuard(@RequestHeader("Authorization") String authHeader, @PathVariable String guardId) {
        ResponseEntity<?> errorResponse = verifyTokenAndGetErrorResponse(authHeader, "ADMIN");
        if (errorResponse != null) {
            return errorResponse; // Stops execution and returns 401/403 error
        }
        try {
            adminService.deleteGuard(guardId);
            return ResponseEntity.noContent().build();
        }
        catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/listGuards")
    public ResponseEntity<?> listGuards(@RequestHeader("Authorization") String authHeader) {
        ResponseEntity<?> errorResponse = verifyTokenAndGetErrorResponse(authHeader, "ADMIN");
        if(errorResponse != null) {
            return errorResponse;
        }
        try {
            List<Guard> guards = adminService.listMyGuards();
            return ResponseEntity.ok(guards);
        }
        catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

    }


}

