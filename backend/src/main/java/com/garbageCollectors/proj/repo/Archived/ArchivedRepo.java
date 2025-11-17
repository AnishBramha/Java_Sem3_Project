package com.garbageCollectors.proj.repo.Archived;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArchivedRepo extends MongoRepository<Archived, String> {


}
