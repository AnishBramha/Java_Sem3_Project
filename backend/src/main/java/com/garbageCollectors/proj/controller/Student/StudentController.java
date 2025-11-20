package com.garbageCollectors.proj.controller.Student;

import com.garbageCollectors.proj.model.Student.Student;
import com.garbageCollectors.proj.model.Student.StudentRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepo studentRepo;

    @PatchMapping("/addPhoneNumbers/{id}")
    public ResponseEntity<StudentResponseDTO> updateStudentByPhoneNumber(
            @PathVariable String id,
            @RequestBody StudentRequestDTO request) {

        Optional<Student> maybeStudent = this.studentRepo.findById(id);

        if (maybeStudent.isEmpty())
            return ResponseEntity.notFound().build();

        Student currentStudent = maybeStudent.get();

        if (request.getPhoneNumbers() != null) {

            List<String> current = new ArrayList<>(currentStudent.getPhoneNumbers());
            current.addAll(request.getPhoneNumbers());

            currentStudent.setPhoneNumbers(current);
        }

        Student savedStudent = this.studentRepo.save(currentStudent);

        StudentResponseDTO response = StudentResponseDTO.builder()
                .id(savedStudent.getId())
                .email(savedStudent.getEmail())
                .name(savedStudent.getName())
                .phoneNumbers(savedStudent.getPhoneNumbers())
                .build();

        return ResponseEntity.ok(response);
    }



    // DEBUG

    @PostMapping
    public ResponseEntity<StudentResponseDTO> createStudent(@RequestBody StudentRequestDTO request) {

        Student student = Student.builder()
                .email(request.getEmail())
                .name(request.getName())
                .phoneNumbers(request.getPhoneNumbers())
                .accessToken("123")
                .refreshToken("456")
                .build();

        Student savedStudent = this.studentRepo.save(student);

        StudentResponseDTO response = StudentResponseDTO.builder()
                .id(savedStudent.getId())
                .email(savedStudent.getEmail())
                .name(savedStudent.getName())
                .phoneNumbers(savedStudent.getPhoneNumbers())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Student> getAllStudents() {

        return this.studentRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> getStudentById(@PathVariable String id) {

        return this.studentRepo.findById(id)
                .map(student -> StudentResponseDTO.builder()
                        .id(student.getId())
                        .email(student.getEmail())
                        .name(student.getName())
                        .phoneNumbers(student.getPhoneNumbers())
                        .build())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<StudentResponseDTO> getStudentByEmail(@RequestParam String email) {

        return this.studentRepo.findByEmail(email)
                .map(student -> StudentResponseDTO.builder()
                        .id(student.getId())
                        .email(student.getEmail())
                        .name(student.getName())
                        .phoneNumbers(student.getPhoneNumbers())
                        .build())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> updateStudent(
            @PathVariable String id,
            @RequestBody StudentRequestDTO request) {

        Optional<Student> maybeStudent = this.studentRepo.findById(id);

        if (maybeStudent.isEmpty())
            return ResponseEntity.notFound().build();

        Student currentStudent = maybeStudent.get();

        if (request.getEmail() != null)
            currentStudent.setEmail(request.getEmail());

        if (request.getName() != null)
            currentStudent.setName(request.getName());

        if (request.getPhoneNumbers() != null)
            currentStudent.setPhoneNumbers(request.getPhoneNumbers());

        Student savedStudent = this.studentRepo.save(currentStudent);

        StudentResponseDTO response = StudentResponseDTO.builder()
                .id(savedStudent.getId())
                .email(savedStudent.getEmail())
                .name(savedStudent.getName())
                .phoneNumbers(savedStudent.getPhoneNumbers())
                .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable String id) {

        if (!this.studentRepo.existsById(id))
            return ResponseEntity.notFound().build();

        this.studentRepo.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}







