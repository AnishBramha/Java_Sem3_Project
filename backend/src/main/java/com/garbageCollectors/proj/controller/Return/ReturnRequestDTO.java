package com.garbageCollectors.proj.controller.Return;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ReturnRequestDTO {

    private String deliveryCompany;
    private String name;
    private List<String> phoneNumbers;
}
