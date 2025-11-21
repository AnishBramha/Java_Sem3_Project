package com.garbageCollectors.proj.controller.Return;

import com.garbageCollectors.proj.model.Return.Return;
import com.garbageCollectors.proj.model.Return.ReturnRepo;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/return")
@RequiredArgsConstructor
public class ReturnController {
    private final ReturnRepo returnRepo;
    @PostMapping("/add")
    public ResponseEntity<ReturnResponseDTO> addReturnItem(@RequestBody ReturnRequestDTO request){
        Return newReturnPackage = Return.builder().email(request.getEmail()).name(request.getName()).status("pending")
                .phoneNumbers(request.getPhoneNumbers()).timestamp(LocalDateTime.now()).deliveryCompany(request.getDeliveryCompany())
                .accessToken("123").refreshToken("456").build();

        Return returnedPackage = this.returnRepo.save(newReturnPackage);

        ReturnResponseDTO response = ReturnResponseDTO.builder().id(returnedPackage.getId()).status(returnedPackage.getStatus()).email(returnedPackage.getEmail()).name(returnedPackage.getName())
                .phoneNumbers(returnedPackage.getPhoneNumbers()).timestamp(returnedPackage.getTimestamp()).deliveryCompany(returnedPackage.getDeliveryCompany()).build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteReturnByEmail(@RequestParam String email){
        if(this.returnRepo.findByEmail(email)==null){
            return ResponseEntity.notFound().build();
        }
        this.returnRepo.deleteByEmail(email);
        return ResponseEntity.noContent().build();

    }
    
}
