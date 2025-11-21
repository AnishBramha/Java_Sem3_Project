package com.garbageCollectors.proj.controller.Auth;

import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;

@Data
@Builder
public class AuthRequestDTO {

    private String name;
    private String email;
    private ArrayList phoneNumbers;

}
