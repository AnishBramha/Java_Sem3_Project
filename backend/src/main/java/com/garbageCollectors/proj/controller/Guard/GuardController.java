package com.garbageCollectors.proj.controller.Guard;

import com.garbageCollectors.proj.controller.Package.PackageRequestDTO;
import com.garbageCollectors.proj.model.Guard.Guard;
import com.garbageCollectors.proj.model.Guard.GuardRepo;
import com.garbageCollectors.proj.model.Package.Package;
import com.garbageCollectors.proj.model.Package.PackageRepo;
import com.garbageCollectors.proj.model.Student.Student;
import com.garbageCollectors.proj.model.Student.StudentRepo;
import com.garbageCollectors.proj.service.EmailService;
import com.garbageCollectors.proj.service.JWTService;
import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/guard")
@AllArgsConstructor
public class GuardController {

    private final GuardRepo guardRepo;
    private final PackageRepo packageRepo;
    private final JWTService service;
    private final StudentRepo studentRepo;
    private final EmailService emailService;

    private Claims verifyToken(String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer "))
            throw new IllegalArgumentException("Missing token");

        String token = authHeader.substring(7);

        return this.service.verifyToken(token).getBody();
    }


    @PostMapping("/login")
    public ResponseEntity<GuardResponseDTO> login(@RequestBody GuardRequestDTO request) {

        Optional<Guard> maybeGuard = this.guardRepo.findByName(request.getName());

        if (maybeGuard.isEmpty())
            return ResponseEntity.notFound().build();

        Guard guard = maybeGuard.get();

        if (guard.getPswd().equals(request.getPswd())) {

            GuardResponseDTO response = GuardResponseDTO.builder()
                    .id(guard.getId())
                    .token(service.createToken(guard.getName(), "GUARD"))
                    .build();

            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PatchMapping("/scan")
    public ResponseEntity<?> scanPackage(@RequestHeader("Authorization") String authHeader,
                                         @RequestBody ScanRequestDTO details) {

        try {

            var claims = this.verifyToken(authHeader);

            if (claims.get("role").toString().equals("GUARD")) {

                Optional<Package> maybePackage = this.packageRepo.findById(details.getId());

                if (maybePackage.isEmpty())
                    return ResponseEntity.notFound().build();

                var collectedPackage = maybePackage.get();
                collectedPackage.setStatus("Collected");
                collectedPackage.setReceivedEmail(details.getEmail());
                collectedPackage.setReceivedTnD(LocalDateTime.now());

                this.packageRepo.save(collectedPackage);

                return ResponseEntity.ok().body("Package scanned and collected");
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
    }

    @PostMapping("/addPackage")
    public ResponseEntity<?> addPackage(@RequestHeader("Authorization") String authHeader,
                                        @RequestBody PackageRequestDTO request) {

        try {
            var claims = this.verifyToken(authHeader);

            if (!claims.get("role").toString().equals("GUARD")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("{\"message\":\"Not Authorized\"}");
            }

            // Save package
            var newPackage = Package.builder()
                    .deliveryCompany(request.getDeliveryCompany())
                    .phoneNumber(request.getPhoneNumber())
                    .Name(request.getName())
                    .status("Active")
                    .build();

            this.packageRepo.save(newPackage);

            // -------------------------------
            // FIND STUDENT BY PHONE NUMBER
            // -------------------------------
            List<Student> students =
                    studentRepo.findByPhoneNumbersContaining(request.getPhoneNumber());

            if (students.isEmpty()) {
                System.out.println("⚠ No student found with phone: " + request.getPhoneNumber());
                return ResponseEntity.ok("{\"message\":\"Package added, but email not sent (no student found)\"}");
            }

            Student student = students.get(0);
            System.out.println(student);
            String studentEmail = student.getEmail();


            String html = GuardController.emailTemplatePackageAdded
                    .replace("{{NAME}}", request.getName())
                    .replace("{{PHONE}}", request.getPhoneNumber())
                    .replace("{{COURIER}}", request.getDeliveryCompany());

            // Send email
            emailService.sendHtmlMail(
                    studentEmail,
                    "📦 ALERT: You have got a package from " + request.getDeliveryCompany(),
                    html
            );

            return ResponseEntity.ok("{\"message\":\"Package added & email sent\"}");

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"message\":\"Invalid or expired token\"}");
        }
    }



    // DEBUG

    @PostMapping
    public ResponseEntity<GuardResponseDTO> createGuard(@RequestBody GuardRequestDTO request) {

        Guard guard = Guard.builder()
                .name(request.getName())
                .pswd(request.getPswd())
                .build();

        Guard savedGuard = this.guardRepo.save(guard);

        GuardResponseDTO response = GuardResponseDTO.builder()
                .id(guard.getId())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Guard> getAllGuards() {

        return this.guardRepo.findAll();
    }

    public static String emailTemplatePackageAdded =
            "<!DOCTYPE html>\n" +
                    "<html lang=\"en\">\n" +
                    "<head>\n" +
                    "  <meta charset=\"UTF-8\" />\n" +
                    "  <title>Package Notification</title>\n" +
                    "  <style>\n" +
                    "    body {\n" +
                    "      background: #f5f7ff;\n" +
                    "      font-family: Arial, sans-serif;\n" +
                    "      margin: 0;\n" +
                    "      padding: 0;\n" +
                    "    }\n" +
                    "\n" +
                    "    .container {\n" +
                    "      max-width: 600px;\n" +
                    "      margin: 40px auto;\n" +
                    "      background: #ffffff;\n" +
                    "      border-radius: 16px;\n" +
                    "      padding: 30px;\n" +
                    "      box-shadow: 0 10px 30px rgba(100, 100, 255, 0.15);\n" +
                    "      border: 1px solid #e6e6ff;\n" +
                    "    }\n" +
                    "\n" +
                    "    .header {\n" +
                    "      text-align: center;\n" +
                    "      background: linear-gradient(to right, #4f46e5, #9333ea);\n" +
                    "      padding: 18px;\n" +
                    "      border-radius: 12px;\n" +
                    "      color: #000000;\n" +
                    "      font-size: 22px;\n" +
                    "      font-weight: bold;\n" +
                    "      letter-spacing: 0.5px;\n" +
                    "      margin-bottom: 25px;\n" +
                    "    }\n" +
                    "\n" +
                    "    .content {\n" +
                    "      font-size: 15px;\n" +
                    "      color: #444444;\n" +
                    "      line-height: 1.6;\n" +
                    "    }\n" +
                    "\n" +
                    "    .highlight-box {\n" +
                    "      background: #f3f0ff;\n" +
                    "      border-left: 5px solid #7c3aed;\n" +
                    "      padding: 12px 18px;\n" +
                    "      border-radius: 10px;\n" +
                    "      margin: 20px 0;\n" +
                    "      font-size: 14px;\n" +
                    "    }\n" +
                    "\n" +
                    "    .footer {\n" +
                    "      margin-top: 35px;\n" +
                    "      font-size: 13px;\n" +
                    "      color: #777;\n" +
                    "      text-align: center;\n" +
                    "      border-top: 1px solid #eee;\n" +
                    "      padding-top: 15px;\n" +
                    "    }\n" +
                    "\n" +
                    "    .btn {\n" +
                    "      display: inline-block;\n" +
                    "      margin-top: 20px;\n" +
                    "      background: linear-gradient(to right, #4f46e5, #9333ea);\n" +
                    "      color: white;\n" +
                    "      padding: 10px 20px;\n" +
                    "      border-radius: 8px;\n" +
                    "      text-decoration: none;\n" +
                    "      font-weight: bold;\n" +
                    "    }\n" +
                    "  </style>\n" +
                    "</head>\n" +
                    "\n" +
                    "<body>\n" +
                    "\n" +
                    "  <div class=\"container\">\n" +
                    "\n" +
                    "    <div class=\"header\">\n" +
                    "      📦 New Package Arrived\n" +
                    "    </div>\n" +
                    "\n" +
                    "    <div class=\"content\">\n" +
                    "\n" +
                    "      Hello <b>{{NAME}}</b>,<br/><br/>\n" +
                    "      We’re excited to inform you that a new package addressed to you has arrived at the <b>IIIT-B Reception</b>.\n" +
                    "\n" +
                    "      <div class=\"highlight-box\">\n" +
                    "        <b>📦 Package Details</b><br/>\n" +
                    "        <b>Name:</b> {{NAME}}<br/>\n" +
                    "        <b>Phone:</b> {{PHONE}}<br/>\n" +
                    "        <b>Courier:</b> {{COURIER}}<br/>\n" +
                    "        <b>Status:</b> Active (Awaiting pickup)\n" +
                    "      </div>\n" +
                    "\n" +
                    "      You may collect your package anytime during the reception working hours by showing your student ID.\n" +
                    "\n" +
                    "      <br/><br/>\n" +
                    "\n" +
                    "      <a class=\"btn\" href=\"https://your-portal-link.com\">\n" +
                    "        View Package Status\n" +
                    "      </a>\n" +
                    "\n" +
                    "    </div>\n" +
                    "\n" +
                    "    <div class=\"footer\">\n" +
                    "      This is an automated message from the IIIT Bangalore Parcel Management System.<br/>\n" +
                    "      Please do not reply to this email.\n" +
                    "    </div>\n" +
                    "\n" +
                    "  </div>\n" +
                    "\n" +
                    "</body>\n" +
                    "</html>";


}






