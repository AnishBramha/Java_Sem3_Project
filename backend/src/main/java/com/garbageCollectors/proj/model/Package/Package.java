package com.garbageCollectors.proj.model.Package;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Document(collection = "packages")
public class Package {
    @Id
    private String id;

    private String status;
    @Builder.Default
    private LocalDateTime deliveredTnD=LocalDateTime.now();
    private LocalDateTime receivedTnD;
    private String Name;
    private String phoneNumber;
    private String deliveryCompany;
    private String receivedEmail;
}





