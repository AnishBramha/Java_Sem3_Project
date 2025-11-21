package com.garbageCollectors.proj.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;

@Service
public class MsAuthService {

    @Value("${ms.client.id}")
    private String clientId;

    @Value("${ms.client.secret}")
    private String clientSecret;

    @Value("${ms.redirect.uri}")
    private String redirectUri;

    RestTemplate rest = new RestTemplate();
    ObjectMapper mapper = new ObjectMapper();

    public String exchangeCodeForToken(String code) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("client_id", clientId);
        form.add("client_secret", clientSecret);
        form.add("grant_type", "authorization_code");
        form.add("code", code);
        form.add("redirect_uri", redirectUri);

        HttpEntity<MultiValueMap<String, String>> request =
                new HttpEntity<>(form, headers);

        String tokenEndpoint =
                "https://login.microsoftonline.com/common/oauth2/v2.0/token";

        return rest.postForObject(tokenEndpoint, request, String.class);
    }

    public JsonNode decodeIdToken(String idToken) throws Exception {
        String[] parts = idToken.split("\\.");
        String body = new String(Base64.getUrlDecoder().decode(parts[1]));
        return mapper.readTree(body);
    }


    public String getEmailFromIdToken(JsonNode claims) {
        if (claims.has("email")) return claims.get("email").asText();
        if (claims.has("preferred_username")) return claims.get("preferred_username").asText();
        return null;
    }

    public String getNameFromIdToken(JsonNode claims) {
        return claims.has("name") ? claims.get("name").asText() : null;
    }

    public String getOidFromIdToken(JsonNode claims) {
        return claims.has("oid") ? claims.get("oid").asText() : null;
    }


}
