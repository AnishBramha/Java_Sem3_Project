package com.garbageCollectors.proj.controller.Student;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StudentResponseDTO {

    private String id;
    private String email;
    private String name;
    private List<String> phoneNumbers;
}



