package com.garbageCollectors.proj.model.Return;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "return")
@Data
public class Return {
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
