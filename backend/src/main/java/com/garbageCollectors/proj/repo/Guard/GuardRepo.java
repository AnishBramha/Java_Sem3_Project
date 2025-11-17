package com.garbageCollectors.proj.repo.Guard;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GuardRepo extends MongoRepository<Guard, String> {


}
