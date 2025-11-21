package com.garbageCollectors.proj.model.Return;

import com.garbageCollectors.proj.model.Student.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReturnRepo extends MongoRepository<Return, String> {
    Return findByEmail(String email);
    void deleteByEmail(String email);
}
