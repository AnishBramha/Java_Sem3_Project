package com.garbageCollectors.proj.controller.Guard;

import com.garbageCollectors.proj.controller.Student.StudentRequestDTO;
import com.garbageCollectors.proj.controller.Student.StudentResponseDTO;
import com.garbageCollectors.proj.model.Guard.Guard;
import com.garbageCollectors.proj.model.Guard.GuardRepo;
import com.garbageCollectors.proj.model.Student.Student;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/guard")
@AllArgsConstructor
public class GuardController {

    private final GuardRepo guardRepo;

    @GetMapping("/login")
    public ResponseEntity<GuardResponseDTO> login(@RequestBody GuardRequestDTO request) {

        Optional<Guard> maybeGuard = this.guardRepo.findByName(request.getName());

        if (maybeGuard.isEmpty())
            return ResponseEntity.notFound().build();

        Guard guard = maybeGuard.get();

        if (guard.getPswd().equals(request.getPswd())) {

            GuardResponseDTO response = GuardResponseDTO.builder()
                    .id(guard.getId())
                    .name(guard.getName())
                    .pswd(guard.getPswd())
                    .build();

            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


    // DEBUG

    @PostMapping
    public ResponseEntity<GuardResponseDTO> createStudent(@RequestBody GuardRequestDTO request) {

        Guard guard = Guard.builder()
                .name(request.getName())
                .pswd(request.getPswd())
                .build();

        Guard savedGuard = this.guardRepo.save(guard);

        GuardResponseDTO response = GuardResponseDTO.builder()
                .id(guard.getId())
                .name(guard.getName())
                .pswd(guard.getPswd())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Guard> getAllGuards() {

        return this.guardRepo.findAll();
    }
}






