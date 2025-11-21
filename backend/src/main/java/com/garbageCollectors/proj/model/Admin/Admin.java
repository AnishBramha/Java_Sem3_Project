package com.garbageCollectors.proj.model.Admin;

import com.garbageCollectors.proj.controller.Admin.AdminRequestDTO;
import com.garbageCollectors.proj.controller.Admin.AdminResponseDTO;
import com.garbageCollectors.proj.model.Guard.Guard;
import com.garbageCollectors.proj.model.Guard.GuardRepo;
import com.garbageCollectors.proj.model.Student.StudentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

@Service
public class Admin {

    @Autowired
    private AdminRepo adminRepository;

    @Autowired
    private StudentRepo studentRepository;

    @Autowired
    private GuardRepo guardRepository;

//    TO be done later
//    @Autowired
//    private PasswordEncoder encoder

    public AdminResponseDTO authenticateAdmin(@RequestBody AdminRequestDTO request) {
        /*TODO: Login and Validation to be done here and token*/
        Optional<Admin> adminUserOptional = adminRepository.findByUsername(request.getUsername());

        if(adminUserOptional.isEmpty()) {
            throw new RuntimeException("Invalid Credentials.");
        }

        Admin adminUser = adminUserOptional.get();

        /* TODO: Check if password matches or not, if not throw error */

        AdminResponseDTO response = new AdminResponseDTO();
        response.setMessage("Admin login Successful");
        response.setRole("ROLE_ADMIN");
        return response;
    }

    public AdminResponseDTO authenticateGuard(@RequestBody AdminRequestDTO request) {
        /*TODO: authentication and token*/
        /*TODO: Guard is not set so do later*/
        AdminResponseDTO response = new AdminResponseDTO();
        response.setMessage("Guard Login Successful");
        return response;
    }

    public Guard addGuard(@RequestBody  AdminRequestDTO request) {
        /* TODO: Some checks here */
        Guard newGuard = new Guard();
        /* TODO: Set Fields and return*/
        return newGuard;
    }

    public void deleteGuard(@PathVariable String guardID) {

    }


}





