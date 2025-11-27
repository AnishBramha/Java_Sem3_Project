package com.garbageCollectors.proj.controller.Package;

import com.garbageCollectors.proj.model.Package.PackageRepo;
import com.garbageCollectors.proj.model.Package.PackageService;
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
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

//@RestController
//@RequestMapping("/api/package")
//@AllArgsConstructor
//public class PackageController {
//
//    private final PackageRepo packageRepo;
//    private final StudentRepo studentRepo;
//    private final PackageService packageService;
//    private final MsAuthService msAuthService;
//    private final JWTService jwtService;

//
//    //DEBUG
//    @GetMapping("/getAll")
//    public ResponseEntity<List<Package>> getAllPackages() {
//        try {
//            List<Package> packages = packageRepo.findAll();
//            return ResponseEntity.ok(packages);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }
//
//
//    @GetMapping("/getActive")
//    public ResponseEntity<List<PackageResponseDTO>> findAllActivePackages(
//            @RequestHeader("Authorization") String authHeader,
//            @RequestParam(defaultValue = "0") int page) {
//
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
//        }
//
//        String token = authHeader.substring(7);
//        Claims claims = jwtService.verifyToken(token).getBody();
//        String role = claims.get("role").toString();
//
//        if (!(role.equals("GUARD") || role.equals("ADMIN"))) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
//        }
//
//        int size = 10;
//
//        Pageable pageable = PageRequest.of(
//                page,
//                size,
//                Sort.by(Sort.Direction.DESC, "deliveredTnD")
//        );
//
//        Page<Package> pageData = packageRepo.findByStatus("Active", pageable);
//        List<Package> packages = pageData.getContent();
//
//        List<PackageResponseDTO> response = packages.stream()
//                .map(p -> new PackageResponseDTO(
//                        p.getId(),
//                        p.getStatus(),
//                        p.getDeliveredTnD(),
//                        p.getReceivedTnD(),
//                        p.getPhoneNumber(),
//                        p.getDeliveryCompany()
//                ))
//                .toList();
//
//        return ResponseEntity.ok(response);
//    }
//
//
//
//    @GetMapping("/getCollected")
//    public ResponseEntity<List<PackageResponseDTO>> findCollectedPackages(
//            @RequestHeader("Authorization") String authHeader,
//            @RequestParam(defaultValue = "0") int page) {
//
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
//        }
//
//        String token = authHeader.substring(7);
//        Claims claims = jwtService.verifyToken(token).getBody();
//        String role = claims.get("role").toString();
//
//        if (!(role.equals("GUARD") || role.equals("ADMIN"))) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
//        }
//
//        int size = 10;
//
//        Pageable pageable = PageRequest.of(
//                page,
//                size,
//                Sort.by(Sort.Direction.DESC, "deliveredTnD")
//        );
//
//        Page<Package> pageData = packageRepo.findByStatus("Collected", pageable);
//        List<Package> packages = pageData.getContent();
//
//        List<PackageResponseDTO> response = packages.stream()
//                .map(p -> new PackageResponseDTO(
//                        p.getId(),
//                        p.getStatus(),
//                        p.getDeliveredTnD(),
//                        p.getReceivedTnD(),
//                        p.getPhoneNumber(),
//                        p.getDeliveryCompany()
//                ))
//                .toList();
//
//        return ResponseEntity.ok(response);
//    }
//
//
//
//    @GetMapping("/myActive")
//    public ResponseEntity<List<PackageResponseDTO>> findMyActivePackages(
//            @RequestHeader("Authorization") String authHeader) {
//
//
//
//
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
//        }
//
//        String token = authHeader.substring(7);
//        Claims claims = jwtService.verifyToken(token).getBody();
//        String role = claims.get("role").toString();
//        String email=claims.get("sub").toString();
//
//        if (!role.equals("STUDENT")) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
//        }
//
//        System.out.println(email);
//        Optional<Student> foundStudent = studentRepo.findByEmail(email);
//        if (foundStudent.isEmpty()) {
//            System.out.println("no student found");
//            return ResponseEntity.notFound().build();
//        }
//
//        List<String> phoneNumbers = foundStudent.get().getPhoneNumbers();
//        List<Package> packages = new ArrayList<>();
//
//        for (String phoneNumber : phoneNumbers) {
//            packages.addAll(packageRepo.findByPhoneNumberAndStatus(phoneNumber, "Active"));
//        }
//
//        List<PackageResponseDTO> response = packages.stream()
//                .map(p -> new PackageResponseDTO(
//                        p.getId(),
//                        p.getStatus(),
//                        p.getDeliveredTnD(),
//                        p.getReceivedTnD(),
//                        p.getPhoneNumber(),
//                        p.getDeliveryCompany()
//                ))
//                .toList();
//
//        return ResponseEntity.ok(response);
//    }
//
//
//
//
//    @GetMapping("/myCollected")
//    public ResponseEntity<List<PackageResponseDTO>> findMyCollectedPackages(
//            @RequestHeader("Authorization") String authHeader) {
//
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
//        }
//
//        String token = authHeader.substring(7);
//        Claims claims = jwtService.verifyToken(token).getBody();
//        String role = claims.get("role").toString();
//
//        if (!role.equals("STUDENT")) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
//        }
//
//        String email = claims.get("sub").toString();
//        Optional<Student> foundStudent = studentRepo.findByEmail(email);
//        if (foundStudent.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//
//        List<String> phoneNumbers = foundStudent.get().getPhoneNumbers();
//        List<Package> packages = new ArrayList<>();
//
//        for (String phoneNumber : phoneNumbers) {
//            packages.addAll(packageRepo.findByPhoneNumberAndStatus(phoneNumber, "Collected"));
//        }
//
//        List<PackageResponseDTO> response = packages.stream()
//                .map(p -> new PackageResponseDTO(
//                        p.getId(),
//                        p.getStatus(),
//                        p.getDeliveredTnD(),
//                        p.getReceivedTnD(),
//                        p.getPhoneNumber(),
//                        p.getDeliveryCompany()
//                ))
//                .toList();
//
//        return ResponseEntity.ok(response);
//    }
//
//
//
//
//    @GetMapping("/getPublic")
//    public ResponseEntity<List<PackageResponseDTO>> findAllPublicPackages(
//            @RequestHeader("Authorization") String authHeader,
//            @RequestParam(defaultValue = "0") int page) {
//
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
//        }
//
//        String token = authHeader.substring(7);
//        Claims claims = jwtService.verifyToken(token).getBody();
//        String role = claims.get("role").toString();
//
//        int size = 10;
//
//        Pageable pageable = PageRequest.of(
//                page,
//                size,
//                Sort.by(Sort.Direction.DESC, "deliveredTnD")
//        );
//
//        Page<Package> pageData = packageRepo.findByStatus("PublicActive", pageable);
//        List<Package> packages = pageData.getContent();
//
//        List<PackageResponseDTO> response = packages.stream()
//                .map(p -> new PackageResponseDTO(
//                        p.getId(),
//                        p.getStatus(),
//                        p.getDeliveredTnD(),
//                        p.getReceivedTnD(),
//                        p.getPhoneNumber(),
//                        p.getDeliveryCompany()
//                ))
//                .toList();
//
//        return ResponseEntity.ok(response);
//    }
//
//
//
//}




    @RestController
    @RequestMapping("/api/package")
    @AllArgsConstructor
    public class PackageController {

        private final PackageRepo packageRepo;
        private final StudentRepo studentRepo;
        private final PackageService packageService;
        private final MsAuthService msAuthService;
        private final JWTService jwtService;

        // Helper to build uniform response DTO
        private PackageResponseDTO buildDTO(Package p) {

            String receivedEmail = null;
            String receivedName = null;

            if (p.getReceivedEmail() != null) {
                var pickedStudent = studentRepo.findByEmailIgnoreCase(p.getReceivedEmail());
                if (pickedStudent.isPresent()) {
                    receivedEmail = pickedStudent.get().getEmail(); // ← EMAIL
                    receivedName = pickedStudent.get().getName();
                }
            }


            return PackageResponseDTO.builder()
                    .id(p.getId())
                    .status(p.getStatus())
                    .deliveredTnD(p.getDeliveredTnD())
                    .receivedTnD(p.getReceivedTnD())
                    .phoneNumber(p.getPhoneNumber())
                    .deliveryCompany(p.getDeliveryCompany())
                    .receivedEmail(p.getReceivedEmail())
                    .receivedName(receivedName)
                    .name(p.getName())
                    .build();
        }


        // DEBUG -> returns raw Mongo DB documents
        @GetMapping("/getAll")
        public ResponseEntity<List<Package>> getAllPackages() {
            return ResponseEntity.ok(packageRepo.findAll());
        }

        // ADMIN + GUARD — Active Packages
        @GetMapping("/getActive")
        public ResponseEntity<PaginatedResponse<PackageResponseDTO>> getActive(
                @RequestHeader("Authorization") String authHeader,
                @RequestParam(defaultValue = "0") int page) {

            var claims = jwtService.verifyToken(authHeader.substring(7)).getBody();
            if (!claims.get("role").toString().matches("GUARD|ADMIN"))
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            Pageable pageable = PageRequest.of(page, 10,
                    Sort.by(Sort.Direction.DESC, "deliveredTnD"));

            var pageData = packageRepo.findByStatus("Active", pageable);

            var dtoList = pageData.getContent()
                    .stream()
                    .map(this::buildDTO)
                    .toList();

            return ResponseEntity.ok(
                    new PaginatedResponse<>(
                            dtoList,
                            page,
                            pageData.getTotalPages()
                    )
            );
        }


        // ADMIN + GUARD — Collected Packages
        @GetMapping("/getCollected")
        public ResponseEntity<PaginatedResponse<PackageResponseDTO>> getCollected(
                @RequestHeader("Authorization") String authHeader,
                @RequestParam(defaultValue = "0") int page) {

            var claims = jwtService.verifyToken(authHeader.substring(7)).getBody();
            if (!claims.get("role").toString().matches("GUARD|ADMIN"))
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            Pageable pageable = PageRequest.of(page, 10,
                    Sort.by(Sort.Direction.DESC, "deliveredTnD"));

            var pageData = packageRepo.findByStatus("Collected", pageable);

            var dtoList = pageData.getContent()
                    .stream()
                    .map(this::buildDTO)
                    .toList();

            return ResponseEntity.ok(
                    new PaginatedResponse<>(
                            dtoList,
                            page,
                            pageData.getTotalPages()
                    )
            );
        }


        // STUDENT — My Active Packages
        @GetMapping("/myActive")
        public ResponseEntity<List<PackageResponseDTO>> myActive(
                @RequestHeader("Authorization") String authHeader) {

            var claims = jwtService.verifyToken(authHeader.substring(7)).getBody();
            if (!claims.get("role").equals("STUDENT"))
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            String email = claims.getSubject();
            var student = studentRepo.findByEmail(email).orElse(null);
            if (student == null) return ResponseEntity.notFound().build();

            List<Package> packages = new ArrayList<>();
            for (String number : student.getPhoneNumbers()) {
                packages.addAll(packageRepo.findByPhoneNumberAndStatus(number, "Active"));
            }

            return ResponseEntity.ok(packages.stream().map(this::buildDTO).toList());
        }


        // STUDENT — My Collected Packages
        @GetMapping("/myCollected")
        public ResponseEntity<List<PackageResponseDTO>> myCollected(
                @RequestHeader("Authorization") String authHeader) {

            var claims = jwtService.verifyToken(authHeader.substring(7)).getBody();
            if (!claims.get("role").equals("STUDENT"))
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            String email = claims.getSubject();
            var student = studentRepo.findByEmail(email).orElse(null);
            if (student == null) return ResponseEntity.notFound().build();

            List<Package> packages = new ArrayList<>();
            for (String number : student.getPhoneNumbers()) {
                packages.addAll(packageRepo.findByPhoneNumberAndStatus(number, "Collected"));
            }

            return ResponseEntity.ok(packages.stream().map(this::buildDTO).toList());
        }


        // PUBLIC ACTIVE
        @GetMapping("/getPublic")
        public ResponseEntity<List<PackageResponseDTO>> getPublic(
                @RequestHeader("Authorization") String authHeader,
                @RequestParam(defaultValue = "0") int page) {

            var claims = jwtService.verifyToken(authHeader.substring(7)).getBody();

            Pageable pageable = PageRequest.of(page, 10,
                    Sort.by(Sort.Direction.DESC, "deliveredTnD"));

            var packages = packageRepo.findByStatus("PublicActive", pageable).getContent();

            return ResponseEntity.ok(packages.stream().map(this::buildDTO).toList());
        }

        @GetMapping("/search/collected")
        public ResponseEntity<List<PackageResponseDTO>> searchCollected(
                @RequestHeader("Authorization") String authHeader,
                @RequestParam String query) {

            var claims = jwtService.verifyToken(authHeader.substring(7)).getBody();
            if (!claims.get("role").toString().equals("GUARD")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            System.out.println(query);

            query = query.trim();
            if (query.isEmpty()) return ResponseEntity.badRequest().build();

            var results = packageRepo
                    .searchByAnyField(query, "Collected") // Use the new method
                    .stream()
                    .map(this::buildDTO)
                    .limit(10)
                    .toList();

            return ResponseEntity.ok(results);
        }


        @GetMapping("/search/active")
        public ResponseEntity<List<PackageResponseDTO>> searchActive(
                @RequestHeader("Authorization") String authHeader,
                @RequestParam String query) {

            var claims = jwtService.verifyToken(authHeader.substring(7)).getBody();
            if (!claims.get("role").toString().equals("GUARD")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            System.out.println(query);

            query = query.trim();
            if (query.isEmpty()) return ResponseEntity.badRequest().build();

            var results = packageRepo
                    .searchByAnyField(query, "Active") // Use the new method
                    .stream()
                    .map(this::buildDTO)
                    .limit(10)
                    .toList();

            return ResponseEntity.ok(results);
        }



    }