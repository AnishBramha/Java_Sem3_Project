package com.garbageCollectors.proj.model.Admin;

import com.garbageCollectors.proj.controller.Admin.AdminRequestDTO;
import com.garbageCollectors.proj.controller.Admin.AdminResponseDTO;
import com.garbageCollectors.proj.model.Guard.Guard;
import com.garbageCollectors.proj.model.Guard.GuardRepo;
import com.garbageCollectors.proj.model.Student.StudentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Service;

@Service
public class Admin {
    @Autowired
    private StudentRepo studentRepository;

    @Autowired
    private GuardRepo guardRepository;

//    TO be done later
//    @Autowired
//    private PasswordEncoder encoder

    public AdminResponseDTO authenticateAdmin(AdminRequestDTO request) {
        /*TODO: Login and Validation to be done here and token*/
        AdminResponseDTO response = new AdminResponseDTO();
        response.setMessage("Admin login Successful");
        return response;
    }

    public AdminResponseDTO authenticateGuard(AdminRequestDTO request) {
        /*TODO: authentication and token*/
        AdminResponseDTO response = new AdminResponseDTO();
        response.setMessage("Guard Login Successful");
        return response;
    }

    public Guard addGuard(AdminRequestDTO request) {
        /* Some checks here */
        Guard newGuard = new Guard();
        /*Set Fields and return*/
        return newGuard;
    }

    public void deleteGuard(String guardID) {

    }


}





