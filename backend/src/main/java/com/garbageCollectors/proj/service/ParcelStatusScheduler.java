package com.garbageCollectors.proj.service;

import com.garbageCollectors.proj.model.Package.PackageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class ParcelStatusScheduler {
    @Autowired
    private PackageRepo packageRepository;

    @Scheduled(cron = "0 0 0 * * ?")
    public void refreshParcelStatus() {
        /*TODO: Fetch packages and update their status*/

    }
}
