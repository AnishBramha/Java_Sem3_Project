package com.garbageCollectors.proj.model.Package;

import com.garbageCollectors.proj.controller.Package.PackageResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class PackageService {

    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Package> dynamicSearch(Map<String, String> params) {

        List<Criteria> criteriaList = new ArrayList<>();

        // Filter: Case sensitive(Status,id,and email)
        if (params.containsKey("id")) {
            criteriaList.add(Criteria.where("id").is(params.get("id")));
        }
        if (params.containsKey("status")) {
            criteriaList.add(Criteria.where("status").is(params.get("status")));
        }
        if (params.containsKey("email")) {
            criteriaList.add(Criteria.where("email").is(params.get("email")));
        }

        // Filter: deliveryCompany contains (case-insensitive)
        if (params.containsKey("deliveryCompany")) {
            String deliveryCompany = params.get("deliveryCompany");
            criteriaList.add(
                    Criteria.where("deliveryCompany")
                            .regex(Pattern.compile(Pattern.quote(deliveryCompany), Pattern.CASE_INSENSITIVE))
            );
        }

        // Filter: deliveredTnD range
        Date minDelivered = parseInstant(params.get("minDeliveredAt"));
        Date maxDelivered = parseInstant(params.get("maxDeliveredAt"));

        if (minDelivered != null && maxDelivered != null) {
            criteriaList.add(Criteria.where("deliveredTnD").gte(minDelivered).lte(maxDelivered));
        } else if (minDelivered != null) {
            criteriaList.add(Criteria.where("deliveredTnD").gte(minDelivered));
        } else if (maxDelivered != null) {
            criteriaList.add(Criteria.where("deliveredTnD").lte(maxDelivered));
        }

        // Filter: recievedTnD range
        Date minRecieved = parseInstant(params.get("minRecievedAt"));
        Date maxRecieved = parseInstant(params.get("maxRecievedAt"));

        if (minRecieved != null && maxRecieved != null) {
            criteriaList.add(Criteria.where("recievedTnD").gte(minRecieved).lte(maxRecieved));
        } else if (minRecieved != null) {
            criteriaList.add(Criteria.where("recievedTnD").gte(minRecieved));
        } else if (maxRecieved != null) {
            criteriaList.add(Criteria.where("recievedTnD").lte(maxRecieved));
        }

        Criteria finalCriteria =
                criteriaList.isEmpty()
                        ? new Criteria()
                        : new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));


        Query query = Query.query(finalCriteria);

        // Sorting: newest first (optional)
        query.with(Sort.by(Sort.Direction.DESC, "deliveredTnD"));

        return mongoTemplate.find(query, Package.class);
    }

    private Date parseInstant(String iso) {
        if (iso == null) return null;
        try {
            return Date.from(Instant.parse(iso));
        } catch (Exception e) {
            return null;
        }
    }

}

