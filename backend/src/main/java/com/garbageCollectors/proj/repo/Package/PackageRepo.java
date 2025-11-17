package com.garbageCollectors.proj.repo.Package;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PackageRepo extends MongoRepository<Package, String> {


}
