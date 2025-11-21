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

    @PutMapping("/login")
    public ResponseEntity<AdminResponseDTO> adminLogin(@RequestBody AdminRequestDTO request) {
        AdminResponseDTO response = adminService.authenticateAdmin(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/addGuard")
    public ResponseEntity<Guard> addGuard(@RequestBody AdminRequestDTO request) {
        Guard newGuard = adminService.addGuard(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(newGuard);
    }

    @DeleteMapping("/delGuard/{guardId}")
    public ResponseEntity<Void> deleteGuard(@PathVariable String guardId) {
        adminService.deleteGuard(guardId);
        return ResponseEntity.noContent().build();
    }


}

