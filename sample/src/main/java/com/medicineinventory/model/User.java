package com.medicineinventory.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    
    @Column(nullable = false, length = 50)
    private String name;
    
    @Column(nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(nullable = false, length = 100)
    private String password;
    
    @Column(nullable = false, length = 20)
    private String role; // ADMIN, PHARMACIST, CUSTOMER
    
    @Column(length = 15)
    private String phone;
    
    @Column(length = 200)
    private String address;
    
    @Column(nullable = false)
    private LocalDateTime joinDate = LocalDateTime.now();
}