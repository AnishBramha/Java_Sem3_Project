package com.garbageCollectors.proj.controller.Return;

import com.garbageCollectors.proj.controller.Student.StudentResponseDTO;
import com.garbageCollectors.proj.model.Return.Return;
import com.garbageCollectors.proj.model.Return.ReturnRepo;
import com.garbageCollectors.proj.model.Student.StudentRepo;
import com.garbageCollectors.proj.service.JWTService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/return")
@RequiredArgsConstructor
public class ReturnController {
    private final ReturnRepo returnRepo;
    private final JWTService jwtService;
    private final StudentRepo studentRepo;
    @PostMapping("/add")
    public ResponseEntity<?> addReturnItem(@RequestHeader ("Authorization") String authHeader, @RequestBody ReturnRequestDTO request){
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }
        try {
            String token = authHeader.substring(7);
            Jws<Claims> data = jwtService.verifyToken(token);
            Claims claims = data.getBody();
            String email = claims.getSubject();
            String role = claims.get("role").toString();
            if(!role.equals("GUARD")){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("");
            }
            Return newReturnPackage = Return.builder().email(email)
                    .name(request.getName()).status("pending")
                    .phoneNumbers(request.getPhoneNumbers()).
                    timestamp(LocalDateTime.now())
                    .deliveryCompany(request.getDeliveryCompany()).build();

            Return returnedPackage = this.returnRepo.save(newReturnPackage);

            ReturnResponseDTO response = ReturnResponseDTO.builder().
                    id(returnedPackage.getId()).status(returnedPackage.getStatus())
                    .email(returnedPackage.getEmail()).name(returnedPackage.getName())
                    .phoneNumbers(returnedPackage.getPhoneNumbers())
                    .timestamp(returnedPackage.getTimestamp())
                    .deliveryCompany(returnedPackage.getDeliveryCompany()).build();

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("");
        }
    }
    //return -- same database+check (guard)
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteReturnById(@RequestHeader ("Authorization") String authHeader, @RequestBody String id){
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }
        try {
            String token = authHeader.substring(7);
            Jws<Claims> data = jwtService.verifyToken(token);
            Claims claims = data.getBody();
            String email = claims.getSubject();
            String role = claims.get("role").toString();
            if(!role.equals("GUARD")){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("what");
            }
            Return returnPackage = returnRepo.findById(id).orElse(null);
            if(returnPackage!=null){
                this.returnRepo.deleteById(id);
            }
            else{
                return ResponseEntity.notFound().build();
            }
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("");
        }
        return ResponseEntity.noContent().build();
    }
    //new /api/returns check+ returns(only guard)
    @PatchMapping("/returned")
    public ResponseEntity<?> returnSuccess(@RequestHeader("Authorization") String authHeader,@RequestBody String id){
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }
        try {
            String token = authHeader.substring(7);
            Jws<Claims> data = jwtService.verifyToken(token);
            Claims claims = data.getBody();
            String email = claims.getSubject();
            String role = claims.get("role").toString();
            if (!role.equals("GUARD")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("");
            }

            System.out.println(id);

            Return returnPackage = returnRepo.findById(id).orElse(null);
            if(returnPackage!=null) {
                returnPackage.setStatus("returned");
                this.returnRepo.save(returnPackage);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("");
        }
        return ResponseEntity.ok().build();
    }

    //check -- only guard
    @PatchMapping("/rejected")
    public ResponseEntity<?> returnRejected(@RequestHeader("Authorization") String authHeader,@RequestBody String id) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }
        try {
            String token = authHeader.substring(7);
            Jws<Claims> data = jwtService.verifyToken(token);
            Claims claims = data.getBody();
            String email = claims.getSubject();
            String role = claims.get("role").toString();
            if (!role.equals("GUARD")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("");
            }
            Return returnPackage = returnRepo.findById(id).orElse(null);
            if (returnPackage != null) {
                returnPackage.setStatus("rejected");
                this.returnRepo.save(returnPackage);
            } else {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("");
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyReturns(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }

        try {
            String token = authHeader.substring(7);
            Jws<Claims> data = jwtService.verifyToken(token);
            Claims claims = data.getBody();

            if (!claims.get("role").equals("STUDENT")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String email = claims.getSubject();


            var student = studentRepo.findByEmail(email).orElse(null);
            if (student == null) return ResponseEntity.notFound().build();

            List<Return> list = new ArrayList<>();

            for (String mobile : student.getPhoneNumbers()) {
                list.addAll(returnRepo.findByPhoneNumbers(mobile));
            }

            var response = list.stream().map(r ->
                    ReturnResponseDTO.builder()
                            .id(r.getId())
                            .status(r.getStatus())
                            .email(r.getEmail())
                            .name(r.getName())
                            .phoneNumbers(r.getPhoneNumbers())
                            .timestamp(r.getTimestamp())
                            .deliveryCompany(r.getDeliveryCompany())
                            .build()
            ).toList();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("");
        }
    }


    @GetMapping("/all")
    public ResponseEntity<?> getAllReturns(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }

        try {
            String token = authHeader.substring(7);
            Jws<Claims> data = jwtService.verifyToken(token);
            Claims claims = data.getBody();
            String role = claims.get("role").toString();

            if (!role.equals("GUARD")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("");
            }

            var list = returnRepo.findAll();

            var response = list.stream().map(r ->
                    ReturnResponseDTO.builder()
                            .id(r.getId())
                            .status(r.getStatus())
                            .email(r.getEmail())
                            .name(r.getName())
                            .phoneNumbers(r.getPhoneNumbers())
                            .timestamp(r.getTimestamp())
                            .deliveryCompany(r.getDeliveryCompany())
                            .build()
            ).toList();

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("");
        }
    }



    @GetMapping("/search")
    public ResponseEntity<?> findReturnPackage(@RequestHeader("Authorization") String authHeader,@RequestBody String id){
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }
        try {
            String token = authHeader.substring(7);
            Jws<Claims> data = jwtService.verifyToken(token);
            Claims claims = data.getBody();
            String email = claims.getSubject();
            String role = claims.get("role").toString();
            if (!role.equals("GUARD")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("");
            }
            Return returnPackage = returnRepo.findById(id).orElse(null);
            if(returnPackage!=null) {
                ReturnResponseDTO response = ReturnResponseDTO.builder()
                        .id(returnPackage.getId())
                        .status(returnPackage.getStatus())
                        .email(returnPackage.getEmail())
                        .name(returnPackage.getName())
                        .phoneNumbers(returnPackage.getPhoneNumbers())
                        .timestamp(returnPackage.getTimestamp())
                        .deliveryCompany(returnPackage.getDeliveryCompany()).build();
                return new ResponseEntity<>(response,HttpStatus.OK);
            }
            else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("");
        }
    }
}


