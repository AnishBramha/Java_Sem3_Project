package com.garbageCollectors.proj.controller.Archived;

import com.garbageCollectors.proj.model.Archived.ArchivedRepo;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/archived")
@AllArgsConstructor
public class ArchivedController {

    private final ArchivedRepo archivedRepo;


}
