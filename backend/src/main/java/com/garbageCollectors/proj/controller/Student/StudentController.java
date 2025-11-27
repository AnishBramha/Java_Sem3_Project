package com.garbageCollectors.proj.controller.Student;

import com.garbageCollectors.proj.model.Student.Student;
import com.garbageCollectors.proj.model.Student.StudentRepo;
import com.garbageCollectors.proj.service.EmailService;
import com.garbageCollectors.proj.service.JWTService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepo studentRepo;
    private final JWTService service;
    private final EmailService emailService;


    private Claims verifyToken(String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer "))
            throw new IllegalArgumentException("Missing token");

        String token = authHeader.substring(7);

        return this.service.verifyToken(token).getBody();
    }


    @PatchMapping("/addPhoneNumbers")
    public ResponseEntity<?> updateStudentByPhoneNumber(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Student updated) {

        try {
            var claims = this.verifyToken(authHeader);

            Optional<Student> maybeStudent = this.studentRepo.findByEmail(claims.getSubject());

            if (maybeStudent.isEmpty())
                return ResponseEntity.notFound().build();

            var student = maybeStudent.get();

            if (claims.getSubject().equals(student.getEmail()) &&
                    claims.get("role").equals("STUDENT")) {

                // Initialize list if null
                if (student.getPhoneNumbers() == null) {
                    student.setPhoneNumbers(new ArrayList<>());
                }

                List<String> existing = student.getPhoneNumbers();
                List<String> incoming = updated.getPhoneNumbers();

                // Filter: add only numbers not already present
                List<String> toAdd = incoming.stream()
                        .filter(num -> !existing.contains(num))
                        .toList();

                existing.addAll(toAdd);

                this.studentRepo.save(student);

                return ResponseEntity.ok().body(
                        Map.of(
                                "message", "Success",
                                "added", toAdd
                        )
                );
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
    }


    @GetMapping("/getPhoneNumbers")
    public ResponseEntity<?> getPhoneNumbers(@RequestHeader("Authorization") String authHeader) {
        try {
            var claims = this.verifyToken(authHeader);
            Optional<Student> maybeStudent = this.studentRepo.findByEmail(claims.getSubject());
            if (maybeStudent.isEmpty())
                return ResponseEntity.notFound().build();
            var student = maybeStudent.get();
            if (claims.getSubject().equals(student.getEmail())) {
                return ResponseEntity.ok().body(Map.of("phoneNumbers", student.getPhoneNumbers()));

            }
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }



    @DeleteMapping("/deletePhoneNumbers")
    public ResponseEntity<?> deletePhoneNumber(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody List<String> numbersToDelete) {

        try {
            var claims = this.verifyToken(authHeader);

            Optional<Student> maybeStudent = this.studentRepo.findByEmail(claims.getSubject());
            if (maybeStudent.isEmpty())
                return ResponseEntity.notFound().build();

            var student = maybeStudent.get();

            if (!claims.getSubject().equals(student.getEmail()) ||
                    !claims.get("role").equals("STUDENT")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            // Ensure list is initialized
            if (student.getPhoneNumbers() == null) {
                student.setPhoneNumbers(new ArrayList<>());
            }

            List<String> existing = student.getPhoneNumbers();

            // Identify what can be deleted
            List<String> deleted = numbersToDelete.stream()
                    .filter(existing::contains)
                    .toList();

            // Identify numbers that don't exist
            List<String> ignored = numbersToDelete.stream()
                    .filter(num -> !existing.contains(num))
                    .toList();

            // Perform deletion
            existing.removeAll(deleted);

            // Save changes
            studentRepo.save(student);

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Deletion completed",
                            "deleted", deleted,
                            "ignored", ignored,
                            "remaining", existing
                    )
            );

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired token");
        }
    }


    // DEBUG
//
//    @PostMapping
//    public ResponseEntity<?> createStudent(
//            @RequestHeader("Authorization") String authHeader,
//            @RequestBody Student newStudent) {
//
//        try {
//
//            var claims = this.verifyToken(authHeader);
//
//            if (claims.get("role").toString().equals("STUDENT")) {
//
//                this.studentRepo.save(newStudent);
//                this.emailService.sendMail("Aryan.Sharma@iiitb.ac.in", "Great stuff!",
//                        "By the way, what mail should we send it to? Extract from the token?");
//
//                return ResponseEntity.ok().build();
//            }
//
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//
//        } catch (Exception e) {
//
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
//        }
//    }
//
//
//    @GetMapping
//    public List<Student> getAllStudents() {
//
//        return this.studentRepo.findAll();
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<?> getStudentById(
//            @RequestHeader("Authorization") String authHeader,
//            @PathVariable String id) {
//
//        try {
//
//            var claims = this.verifyToken(authHeader);
//
//            if (claims.get("role").equals("STUDENT")) {
//
//                Optional<Student> maybeStudent = this.studentRepo.findById(id);
//
//                if (maybeStudent.isEmpty())
//                    return ResponseEntity.notFound().build();
//
//                return new ResponseEntity<>(maybeStudent.get(), HttpStatus.OK);
//            }
//
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//
//        } catch (Exception e) {
//
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
//        }
//    }
//
//    @GetMapping("/search")
//    public ResponseEntity<?> getStudentByEmail(
//            @RequestHeader("Authorization") String authHeader,
//            @RequestParam String email) {
//
//        try {
//
//            var claims = this.verifyToken(authHeader);
//
//            if (claims.get("role").equals("STUDENT")) {
//
//                Optional<Student> maybeStudent = this.studentRepo.findByEmail(email);
//
//                if (maybeStudent.isEmpty())
//                    return ResponseEntity.notFound().build();
//
//                return new ResponseEntity<>(maybeStudent.get(), HttpStatus.OK);
//            }
//
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//
//        } catch (Exception e) {
//
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
//        }
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<?> updateStudent(
//            @RequestHeader("Authorization") String authHeader,
//            @PathVariable String id,
//            @RequestBody Student updatedStudent) {
//
//        try {
//
//            var claims = this.verifyToken(authHeader);
//
//            if (claims.get("role").equals("STUDENT")) {
//
//                Optional<Student> maybeStudent = this.studentRepo.findById(id);
//
//                if (maybeStudent.isEmpty())
//                    return ResponseEntity.notFound().build();
//
//                var newStudent = maybeStudent.get();
//
//                if (updatedStudent.getEmail() != null)
//                    newStudent.setEmail(updatedStudent.getEmail());
//
//                if (updatedStudent.getName() != null)
//                    newStudent.setName(updatedStudent.getName());
//
//                if (updatedStudent.getPhoneNumbers() != null)
//                    newStudent.setPhoneNumbers(updatedStudent.getPhoneNumbers());
//
//                this.studentRepo.save(newStudent);
//
//                return ResponseEntity.ok().build();
//            }
//
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//
//        } catch (Exception e) {
//
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
//        }
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> deleteStudent(
//            @RequestHeader("Authorization") String authHeader,
//            @PathVariable String id) {
//
//        try {
//
//            var claims = this.verifyToken(authHeader);
//
//            if (claims.get("role").equals("STUDENT")) {
//
//                if (!this.studentRepo.existsById(id))
//                    return ResponseEntity.notFound().build();
//
//                this.studentRepo.deleteById(id);
//
//                return ResponseEntity.ok().build();
//            }
//
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//
//        } catch (Exception e) {
//
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
//        }
//    }
}











