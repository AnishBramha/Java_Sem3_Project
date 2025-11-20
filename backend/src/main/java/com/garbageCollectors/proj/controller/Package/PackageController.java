package com.garbageCollectors.proj.controller.Package;

import com.garbageCollectors.proj.model.Package.PackageRepo;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/package")
@AllArgsConstructor
public class PackageController {

    private final PackageRepo packageRepo;


}
