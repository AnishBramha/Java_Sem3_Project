package com.garbageCollectors.proj.repo.Return;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReturnRepo extends MongoRepository<Return, String> {


}
