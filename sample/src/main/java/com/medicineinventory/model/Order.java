package com.medicineinventory.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;
    
    @Column(nullable = false, unique = true, length = 20)
    private String orderNumber;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private LocalDateTime orderDate = LocalDateTime.now();
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(nullable = false, length = 20)
    private String status; // PENDING, CONFIRMED, PROCESSING, DELIVERED, CANCELLED
    
    @Column(length = 200)
    private String deliveryAddress;
    
    @Column(length = 15)
    private String deliveryPhone;
}