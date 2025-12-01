package com.pharmacyinventory.controller;

import com.pharmacyinventory.model.Delivery;
import com.pharmacyinventory.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @GetMapping
    public List<Delivery> getAllDeliveries() {
        return deliveryService.getAllDeliveries();
    }

    @GetMapping("/status/{status}")
    public List<Delivery> getDeliveriesByStatus(@PathVariable Delivery.Status status) {
        return deliveryService.getDeliveriesByStatus(status);
    }

    @GetMapping("/staff/{staffId}")
    public List<Delivery> getDeliveriesByStaff(@PathVariable Long staffId) {
        return deliveryService.getDeliveriesByStaff(staffId);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Delivery> getDeliveryByOrderId(@PathVariable Long orderId) {
        Delivery delivery = deliveryService.getDeliveryByOrderId(orderId);
        if (delivery != null) {
            return ResponseEntity.ok(delivery);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/assign-staff")
    public Delivery assignDeliveryStaff(@PathVariable Long id, @RequestParam Long staffId) {
        return deliveryService.assignDeliveryStaff(id, staffId);
    }

    @PutMapping("/{id}/status")
    public Delivery updateDeliveryStatus(@PathVariable Long id, @RequestParam Delivery.Status status) {
        return deliveryService.updateDeliveryStatus(id, status);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Delivery> getDeliveryById(@PathVariable Long id) {
        return deliveryService.getDeliveryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Delivery> updateDelivery(@PathVariable Long id, @RequestBody Delivery delivery) {
        if (!deliveryService.getDeliveryById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        delivery.setDeliveryId(id);
        return ResponseEntity.ok(deliveryService.saveDelivery(delivery));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDelivery(@PathVariable Long id) {
        if (!deliveryService.getDeliveryById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        deliveryService.deleteDelivery(id);
        return ResponseEntity.noContent().build();
    }
}
