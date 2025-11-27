package com.garbageCollectors.proj.controller.Package;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
public class PackageResponseDTO {
    private String id;
    private String status;
    private LocalDateTime deliveredTnD;
    private LocalDateTime receivedTnD;
    private String phoneNumber;
    private String deliveryCompany;
    private String name;

    private String receivedEmail;

    private String receivedName;

}
