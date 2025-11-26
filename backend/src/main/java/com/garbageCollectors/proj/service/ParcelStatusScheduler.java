package com.garbageCollectors.proj.service;

import com.garbageCollectors.proj.model.Package.Package;
import com.garbageCollectors.proj.model.Package.PackageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ParcelStatusScheduler {
    @Autowired
    private PackageRepo packageRepository;

    @Scheduled(cron = "0 0 0 * * ?")
    public void refreshParcelStatus() {
        /*TODO: Fetch packages and update their status*/
        List<Package> packageList = packageRepository.findAll();
        for(Package parcel : packageList) {
            if(parcel.getStatus().equals("ACTIVE")) {
                LocalDateTime deliveryDate = parcel.getDeliveredTnD();
                LocalDateTime currentDate = LocalDateTime.now();
                Duration duration = Duration.between(deliveryDate, currentDate);
                Duration sevenDays = Duration.ofDays(7);
                if(duration.compareTo(sevenDays) >= 0) {
                    parcel.setStatus("ARCHIVED");
                    packageRepository.save(parcel);
                }
            }
        }

    }
}
