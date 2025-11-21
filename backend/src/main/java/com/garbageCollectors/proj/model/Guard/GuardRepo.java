package com.garbageCollectors.proj.model.Guard;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GuardRepo extends MongoRepository<Guard, String> {

    Optional<Guard> findByName(String name);
}
