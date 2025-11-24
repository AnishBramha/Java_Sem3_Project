package com.garbageCollectors.proj.controller.Auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.garbageCollectors.proj.model.Student.StudentRepo;
import com.garbageCollectors.proj.model.Student.Student;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.garbageCollectors.proj.service.MsAuthService;
import com.garbageCollectors.proj.service.JWTService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final StudentRepo studentRepo;
    private final MsAuthService msAuthService;
    private final JWTService jwtService;


    @Autowired
    private ObjectMapper mapper;

    @GetMapping("/ms/callback")
    public ResponseEntity<Void> callback(@RequestParam("code") String code) throws Exception {

        JsonNode tokens = mapper.readTree(msAuthService.exchangeCodeForToken(code));

        String idToken = tokens.get("id_token").asText();
        JsonNode claims = msAuthService.decodeIdToken(idToken);

        String email = msAuthService.getEmailFromIdToken(claims);
        String displayName = msAuthService.getNameFromIdToken(claims);

        String[] parts = displayName.trim().split(" ", 2);
        String roll = parts[0];
        String name = parts.length > 1 ? parts[1] : "";
        String role = "STUDENT";

        String jwt = jwtService.createToken(email, role);

        String redirectUrl =
                "http://localhost:5173/login/success"
                        + "?token=" + URLEncoder.encode(jwt, StandardCharsets.UTF_8)
                        + "&name=" + URLEncoder.encode(name, StandardCharsets.UTF_8)
                        + "&email=" + URLEncoder.encode(email, StandardCharsets.UTF_8)
                        + "&roll=" + URLEncoder.encode(roll, StandardCharsets.UTF_8)
                        + "&role=" + URLEncoder.encode(role, StandardCharsets.UTF_8);

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(redirectUrl))
                .build();
    }


    @GetMapping("/token/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }

        String token = authHeader.substring(7);

        try {
            Jws<Claims> data = jwtService.verifyToken(token);
            Claims claims = data.getBody();

            Map<String, Object> result = new HashMap<>();
            result.put("isValid",true);
            result.put("email", claims.getSubject());
            result.put("role", claims.get("role"));
            result.put("issuedAt", claims.getIssuedAt());
            result.put("expiresAt", claims.getExpiration());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
    }
}



