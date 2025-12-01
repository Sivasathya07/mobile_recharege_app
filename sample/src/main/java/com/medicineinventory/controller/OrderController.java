package com.medicineinventory.controller;

import com.medicineinventory.model.Order;
import com.medicineinventory.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest orderRequest) {
        Order order = orderService.createOrder(
            orderRequest.getUserId(),
            orderRequest.getTotalAmount(),
            orderRequest.getDeliveryAddress(),
            orderRequest.getDeliveryPhone()
        );
        return ResponseEntity.ok(order);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        List<Order> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
        List<Order> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }
    
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        Order order = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(order);
    }
    
    // DTO for order request
    public static class OrderRequest {
        private Long userId;
        private BigDecimal totalAmount;
        private String deliveryAddress;
        private String deliveryPhone;
        
        // Getters and setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        public String getDeliveryAddress() { return deliveryAddress; }
        public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
        public String getDeliveryPhone() { return deliveryPhone; }
        public void setDeliveryPhone(String deliveryPhone) { this.deliveryPhone = deliveryPhone; }
    }
}