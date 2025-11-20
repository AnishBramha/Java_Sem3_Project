package com.garbageCollectors.proj.model.Student;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "students")
public class Student {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String name;
    private List<String> phoneNumbers;

    @JsonIgnore
    private String accessToken;

    @JsonIgnore
    private String refreshToken;
}






