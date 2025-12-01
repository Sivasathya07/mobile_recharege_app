package com.medicineinventory.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "medicines")
@Data
@NoArgsConstructor
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long medicineId;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, length = 50)
    private String brand;
    
    @Column(nullable = false, length = 100)
    private String category; // Tablet, Syrup, Injection, etc.
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(nullable = false)
    private Integer quantityInStock;
    
    @Column(nullable = false)
    private Integer reorderLevel;
    
    @Column(nullable = false)
    private LocalDate expiryDate;
    
    @Column(nullable = false, length = 50)
    private String batchNumber;
    
    @Column(nullable = false)
    private Boolean requiresPrescription = false;
}