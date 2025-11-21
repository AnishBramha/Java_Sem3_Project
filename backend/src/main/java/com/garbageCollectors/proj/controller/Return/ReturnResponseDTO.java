package com.garbageCollectors.proj.controller.Return;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ReturnResponseDTO {
    private String id;
    private String email;
    private LocalDateTime timestamp;
    private String deliveryCompany;
    private String name;
    private String status;
    private List<String> phoneNumbers;
}
