package com.garbageCollectors.proj.controller.Archived;

import com.garbageCollectors.proj.model.Archived.ArchivedRepo;
import com.garbageCollectors.proj.model.Package.PackageRepo;
import com.garbageCollectors.proj.model.Student.StudentRepo;
import com.garbageCollectors.proj.service.JWTService;
import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.PartialUpdateExtensionsKt;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/archived")
@AllArgsConstructor
public class ArchivedController {

    private final ArchivedRepo archivedRepo;
    private final StudentRepo studentRepo;
    private final PackageRepo packageRepo;
    private final JWTService jwtService;


//    @PatchMapping("/package/")
//    public ResponseEntity<?>
}
