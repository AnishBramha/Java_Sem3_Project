package com.garbageCollectors.proj.model.Admin;

import com.garbageCollectors.proj.controller.Admin.AdminRequestDTO;
import com.garbageCollectors.proj.controller.Admin.AdminResponseDTO;
import com.garbageCollectors.proj.controller.Guard.GuardRequestDTO;
import com.garbageCollectors.proj.model.Guard.Guard;
import com.garbageCollectors.proj.model.Guard.GuardRepo;
import com.garbageCollectors.proj.model.Student.StudentRepo;
import com.garbageCollectors.proj.service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class Admin {

    private String username = "Admin";
    private String password = "123";




    @Autowired
    private StudentRepo studentRepository;

    @Autowired
    private GuardRepo guardRepository;

//    TO be done later

    @Autowired
    private JWTService jwtService;


    public AdminResponseDTO authenticateAdmin(AdminRequestDTO request) {
        /*TODO: Login and Validation to be done here and token*/

        /* TODO: Check if password matches or not, if not throw error */
        if(!request.getPassword().equals(password) || !request.getUsername().equals(username)) {
            throw new RuntimeException("Invalid Credentials.");
        }


        String role = "ADMIN";

        String token = jwtService.createToken(username, role);


        AdminResponseDTO response = new AdminResponseDTO();
        response.setMessage("Admin login Successful");
        response.setToken(token);
        return response;
    }

    public AdminResponseDTO authenticateGuard(AdminRequestDTO request) {
        /*TODO: authentication and token*/
        /*TODO: Guard is not set so do later*/
        AdminResponseDTO response = new AdminResponseDTO();
        response.setMessage("Guard Login Successful");
        return response;
    }

    public Guard addGuard(GuardRequestDTO request) {
        /* TODO: Some checks here */
        Guard newGuard = new Guard();
        /* TODO: Set Fields and return*/
        newGuard.setName(request.getName());
        newGuard.setPswd(request.getPswd());
        guardRepository.save(newGuard);
        return newGuard;
    }

    public void deleteGuard(String guardID) {
        if(!guardRepository.existsById(guardID)) {
            throw new RuntimeException("Guard not found!");
        }
        guardRepository.deleteById(guardID);
    }

    public List<Guard> listMyGuards() {
        List<Guard> guards = guardRepository.findAll();
        return guards;
    }


}





