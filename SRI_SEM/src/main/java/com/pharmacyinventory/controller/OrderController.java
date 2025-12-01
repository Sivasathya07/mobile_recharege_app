package com.pharmacyinventory.controller;

import com.pharmacyinventory.model.Order;
import com.pharmacyinventory.model.OrderItem;
import com.pharmacyinventory.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/status/{status}")
    public List<Order> getOrdersByStatus(@PathVariable Order.Status status) {
        return orderService.getOrdersByStatus(status);
    }

    @PostMapping
    public Order placeOrder(@RequestPart("order") Order order,
                           @RequestPart("items") List<OrderItem> items) throws IOException {
        return orderService.placeOrder(order, items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public Order updateOrderStatus(@PathVariable Long id, @RequestParam Order.Status status) {
        return orderService.updateOrderStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        if (!orderService.getOrderById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
