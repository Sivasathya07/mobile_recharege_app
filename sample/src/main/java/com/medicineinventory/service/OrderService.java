package com.medicineinventory.service;

import com.medicineinventory.model.Order;
import com.medicineinventory.model.User;
import com.medicineinventory.repository.OrderRepository;
import com.medicineinventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    
    public Order createOrder(Long userId, BigDecimal totalAmount, String deliveryAddress, String deliveryPhone) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUser(user);
        order.setTotalAmount(totalAmount);
        order.setStatus("PENDING");
        order.setDeliveryAddress(deliveryAddress);
        order.setDeliveryPhone(deliveryPhone);
        order.setOrderDate(LocalDateTime.now());
        
        return orderRepository.save(order);
    }
    
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserUserId(userId);
    }
    
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }
    
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
    
    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}