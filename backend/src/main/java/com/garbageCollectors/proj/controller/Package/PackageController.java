package com.garbageCollectors.proj.controller.Package;

import com.garbageCollectors.proj.model.Package.PackageRepo;
import com.garbageCollectors.proj.model.Package.Package;
import com.garbageCollectors.proj.model.Student.Student;
import com.garbageCollectors.proj.model.Student.StudentRepo;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.garbageCollectors.proj.service.JWTService;
import com.garbageCollectors.proj.service.MsAuthService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;

import java.util.*;

@RestController
@RequestMapping("/api/package")
@AllArgsConstructor
public class PackageController {

    private final PackageRepo packageRepo;
    private final StudentRepo studentRepo;
    private final MsAuthService msAuthService;
    private final JWTService jwtService;
    @GetMapping("/getActive") //pageable and authorized
    public ResponseEntity<List<PackageResponseDTO>> findAllActivePackages(@RequestHeader("Authorization") String authHeader, @RequestBody int page) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        try {
            String token = authHeader.substring(7);
            Jws<Claims> data = this.jwtService.verifyToken(token);
            Claims claims = (Claims) data.getBody();
            String role = claims.get("role").toString();
            if(!(role.equals("GUARD")||role.equals("ADMIN"))){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            int size = 10;
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
            List<Package> packages = packageRepo.findByStatus("Active", pageable);


            List<PackageResponseDTO> response = packages.stream()
                    .map(p -> new PackageResponseDTO(
                            p.getId(),
                            p.getStatus(),
                            p.getDeliveredTnD(),
                            p.getReceivedTnD(),
                            p.getPhoneNumber(),
                            p.getDeliveryCompany()
                    ))
                    .toList();

            return ResponseEntity.ok(response);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/getCollected") //pageable and authorized
    public ResponseEntity<List<PackageResponseDTO>> findCollectedPackages(@RequestHeader("Authorization") String authHeader, @RequestBody int page) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        try {
            String token = authHeader.substring(7);
            Jws<Claims> data = this.jwtService.verifyToken(token);
            Claims claims = (Claims) data.getBody();
            String role = claims.get("role").toString();
            if(!(role.equals("GUARD")||role.equals("ADMIN"))){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            int size = 10;
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
            List<Package> packages = packageRepo.findByStatus("Collected", pageable);


            List<PackageResponseDTO> response = packages.stream()
                    .map(p -> new PackageResponseDTO(
                            p.getId(),
                            p.getStatus(),
                            p.getDeliveredTnD(),
                            p.getReceivedTnD(),
                            p.getPhoneNumber(),
                            p.getDeliveryCompany()
                    ))
                    .toList();

            return ResponseEntity.ok(response);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/myActive") // only authorized using email
    public ResponseEntity<List<PackageResponseDTO>> findMyActivePackages(@RequestHeader("Authorization") String authHeader,@RequestParam String email){
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        try {
            String token = authHeader.substring(7);
            Jws<Claims> data = this.jwtService.verifyToken(token);
            Claims claims = (Claims) data.getBody();
            String role = claims.get("role").toString();
            if(!role.equals("STUDENT")){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            Optional<Student> foundStudent = studentRepo.findByEmail(email);
            if (foundStudent.isEmpty())
                return ResponseEntity.notFound().build();

            List<String> phoneNumbers = foundStudent.get().getPhoneNumbers();
            List<Package> packages = new ArrayList<>();

            for(String phoneNumber : phoneNumbers){
                packages.addAll(packageRepo.findByPhoneNumberAndStatus("Active", phoneNumber));
            }

            if(packages.isEmpty())
                return ResponseEntity.notFound().build();

            List<PackageResponseDTO> response = packages.stream()
                    .map(p -> new PackageResponseDTO(
                            p.getId(),
                            p.getStatus(),
                            p.getDeliveredTnD(),
                            p.getReceivedTnD(),
                            p.getPhoneNumber(),
                            p.getDeliveryCompany()
                    ))
                    .toList();

            return ResponseEntity.ok(response);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/myCollected")// only authorized using email
    public ResponseEntity<List<PackageResponseDTO>> findMyCollectedPackages(@RequestHeader("Authorization") String authHeader,@RequestParam String email){
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        try {
            String token = authHeader.substring(7);
            Jws<Claims> data = this.jwtService.verifyToken(token);
            Claims claims = (Claims) data.getBody();
            String role = claims.get("role").toString();
            if(!role.equals("STUDENT")){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            Optional<Student> foundStudent = studentRepo.findByEmail(email);
            if (foundStudent.isEmpty())
                return ResponseEntity.notFound().build();

            List<String> phoneNumbers = foundStudent.get().getPhoneNumbers();
            List<Package> packages = new ArrayList<>();

            for(String phoneNumber : phoneNumbers){
                packages.addAll(packageRepo.findByPhoneNumberAndStatus("Collected", phoneNumber));
            }

            if(packages.isEmpty())
                return ResponseEntity.notFound().build();

            List<PackageResponseDTO> response = packages.stream()
                    .map(p -> new PackageResponseDTO(
                            p.getId(),
                            p.getStatus(),
                            p.getDeliveredTnD(),
                            p.getReceivedTnD(),
                            p.getPhoneNumber(),
                            p.getDeliveryCompany()
                    ))
                    .toList();

            return ResponseEntity.ok(response);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

    }


}
