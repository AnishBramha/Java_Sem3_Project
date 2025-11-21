package com.garbageCollectors.proj.model.Admin;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepo extends MongoRepository<Admin, String> {

    Optional<Admin> findByUsername(String username);

}
