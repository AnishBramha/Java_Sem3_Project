package com.garbageCollectors.proj.model.Package;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PackageRepo extends MongoRepository<Package, String> {
    List<Package> findByStatus(String status, Pageable pageable);
    List<Package> findByPhoneNumberAndStatus(String status, String phoneNumber);
    List<Package> findByPhoneNumber(String phoneNumber);
}
