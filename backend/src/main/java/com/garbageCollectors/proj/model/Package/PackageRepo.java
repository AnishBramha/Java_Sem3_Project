package com.garbageCollectors.proj.model.Package;

import com.garbageCollectors.proj.model.Student.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface PackageRepo extends MongoRepository<Package, String> {

    Page<Package> findByStatus(String status, Pageable pageable);

    List<Package> findByPhoneNumberAndStatus(String phoneNumber, String status);

    List<Package> findByPhoneNumber(String phoneNumber);


    List<Package> findByIdContainingIgnoreCaseAndStatus(String query, String collected);


    @Query("{ '_id': { $regex: ?0, $options: 'i' }, 'status': { $regex: ?1, $options: 'i' } }")
    List<Package> searchById(String idPart, String status);


    @Query("{ 'status': ?1, $or: [ " +
            "{ '$expr': { '$regexMatch': { 'input': { '$toString': '$_id' }, 'regex': ?0, 'options': 'i' } } }, " + // Optional: Keep ID search
            "{ 'phoneNumber': { $regex: ?0, $options: 'i' } }, " +
            "{ 'Name': { $regex: ?0, $options: 'i' } } " +
            "] }")
    List<Package> searchByAnyField(String query, String status);

}
