package com.garbageCollectors.proj.controller.Admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminRequestDTO {
    //Fields for login (Both Admin & Guard)
    private String username;
    private String password;

    //Fields for Add Guard
    //Admin provides these details to add a Guard
    private String employeeID;
    private String name;
    private String email;
    private String[] phoneNumbers;
}
