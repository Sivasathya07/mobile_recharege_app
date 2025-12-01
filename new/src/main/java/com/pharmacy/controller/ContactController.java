package com.pharmacy.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:9000") // Allow requests from the same origin
public class ContactController {
    
    @PostMapping
    public ResponseEntity<Map<String, String>> submitContactForm(@RequestParam Map<String, String> formData) {
        // In a real application, you would process the form data here
        // For now, we'll just return a success response
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Your message has been received. We'll get back to you soon!");
        
        return ResponseEntity.ok(response);
    }
}
