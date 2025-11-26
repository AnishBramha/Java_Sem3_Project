package com.garbageCollectors.proj.controller.Package;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PackageRequestDTO {
    private LocalDateTime deliveredTnD;
    private LocalDateTime receivedTnD;
    private String phoneNumber;
    private String deliveryCompany;
    private String email;
}
