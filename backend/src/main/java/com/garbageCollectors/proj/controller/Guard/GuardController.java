package com.garbageCollectors.proj.controller.Guard;

import com.garbageCollectors.proj.controller.Package.PackageRequestDTO;
import com.garbageCollectors.proj.model.Guard.Guard;
import com.garbageCollectors.proj.model.Guard.GuardRepo;
import com.garbageCollectors.proj.model.Package.Package;
import com.garbageCollectors.proj.model.Package.PackageRepo;
import com.garbageCollectors.proj.model.Student.Student;
import com.garbageCollectors.proj.service.JWTService;
import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/guard")
@AllArgsConstructor
public class GuardController {

    private final GuardRepo guardRepo;
    private final PackageRepo packageRepo;
    private final JWTService service;

    private Claims verifyToken(String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer "))
            throw new IllegalArgumentException("Missing token");

        String token = authHeader.substring(7);

        return this.service.verifyToken(token).getBody();
    }


    @GetMapping("/login")
    public ResponseEntity<GuardResponseDTO> login(@RequestBody GuardRequestDTO request) {

        Optional<Guard> maybeGuard = this.guardRepo.findByName(request.getName());

        if (maybeGuard.isEmpty())
            return ResponseEntity.notFound().build();

        Guard guard = maybeGuard.get();

        if (guard.getPswd().equals(request.getPswd())) {

            GuardResponseDTO response = GuardResponseDTO.builder()
                    .id(guard.getId())
                    .token(service.createToken(guard.getName(), "GUARD"))
                    .build();

            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PatchMapping("/scan")
    public ResponseEntity<?> scanPackage(@RequestHeader("Authorization") String authHeader,
                                         @RequestBody ScanRequestDTO details) {

        try {

            var claims = this.verifyToken(authHeader);

            if (claims.get("role").toString().equals("GUARD")) {

                Optional<Package> maybePackage = this.packageRepo.findById(details.getId());

                if (maybePackage.isEmpty())
                    return ResponseEntity.notFound().build();

                var collectedPackage = maybePackage.get();
                collectedPackage.setStatus("Collected");
                collectedPackage.setReceivedEmail(details.getEmail());
                collectedPackage.setReceivedTnD(LocalDateTime.now());

                this.packageRepo.save(collectedPackage);

                return ResponseEntity.ok().body("Package scanned and collected");
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
    }

    @PostMapping("/addPackage")
    public ResponseEntity<?> addPackage(@RequestHeader("Authorization") String authHeader,
                                        @RequestBody PackageRequestDTO request) {

        try {

            var claims = this.verifyToken(authHeader);

            if (claims.get("role").toString().equals("GUARD")) {

                var newPackage = Package.builder()
                        .deliveryCompany(request.getDeliveryCompany())
                        .phoneNumber(request.getPhoneNumber())
                        .status("Active")
                        .deliveredTnD(request.getDeliveredTnD())
                        .build();

                this.packageRepo.save(newPackage);

                return ResponseEntity.ok().body("Package added at reception");
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
    }


    // DEBUG

    @PostMapping
    public ResponseEntity<GuardResponseDTO> createGuard(@RequestBody GuardRequestDTO request) {

        Guard guard = Guard.builder()
                .name(request.getName())
                .pswd(request.getPswd())
                .build();

        Guard savedGuard = this.guardRepo.save(guard);

        GuardResponseDTO response = GuardResponseDTO.builder()
                .id(guard.getId())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Guard> getAllGuards() {

        return this.guardRepo.findAll();
    }
}






