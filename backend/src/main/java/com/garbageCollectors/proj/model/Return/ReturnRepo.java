package com.garbageCollectors.proj.model.Return;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReturnRepo extends MongoRepository<Return, String> {


}
