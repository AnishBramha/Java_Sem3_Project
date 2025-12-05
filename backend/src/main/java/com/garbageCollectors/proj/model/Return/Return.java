package com.garbageCollectors.proj.model.Return;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.micrometer.observation.ObservationFilter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "return")
@Data
public class Return {
    @Id
    private String id;
    private String email;

    private String name;
    private List<String> phoneNumbers;
    private String status;
    private LocalDateTime timestamp;
    private String deliveryCompany;



}
