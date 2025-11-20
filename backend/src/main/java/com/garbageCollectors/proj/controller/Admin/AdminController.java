package com.garbageCollectors.proj.controller.Admin;

import com.garbageCollectors.proj.model.Admin.AdminRepo;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {

    private final AdminRepo adminRepo;


}

