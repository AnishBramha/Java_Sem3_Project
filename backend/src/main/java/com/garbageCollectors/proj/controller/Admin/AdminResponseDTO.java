package com.garbageCollectors.proj.controller.Admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminResponseDTO {
    private String message;
    private String role; // Either Admin or Guard
    private String token;
}
