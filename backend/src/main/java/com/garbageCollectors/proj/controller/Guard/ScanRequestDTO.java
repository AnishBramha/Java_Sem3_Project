package com.garbageCollectors.proj.controller.Guard;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
@Builder
public class ScanRequestDTO {

    @Id
    String id;

    String email;
}


