package com.garbageCollectors.proj.controller.Guard;

import com.garbageCollectors.proj.model.Guard.GuardRepo;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/guard")
@AllArgsConstructor
public class GuardController {

    private final GuardRepo guardRepo;


}
